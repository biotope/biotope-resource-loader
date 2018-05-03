/**
 * VI Resource Loader v1.3.0
 * For documentation see:
 * https://github.com/biotope/biotope-resource-loader
 */

import produce from 'immer';
import './polyfill';

import getPackages from './getPackages';
import getResourcesFromDOM from './getResourcesFromDom';
import checkDependencies from './checkDependencies';
import addToQueue from './addToQueue';
import {
  getComponentResources,
  updateComponentResources
} from './componentResources';

const defaults = {
  container: '', // css selector for document.querySelector
  readyEvent: 'resourcesReady' // needs to be a string
};

const queue = {};

// global options
let options = null;

const init = customOptions => {
  options = Object.assign({}, defaults, customOptions);
  // debug = options.debug ? options.debug : true;

  queue.resources = getResourcesFromDOM(options.container, options);
  // 👷‍ add resources from options
  // ⚠️ that could be buggy, or at least it will not fire any events atm
  if (options.resources) {
    queue.resources.unshift({ resources: options.resources });
  }

  checkDependencies(queue.resources);

  queue.componentResources = getComponentResources(queue.resources);
  queue.requests = addToQueue(queue.componentResources);
  getPackages(queue.requests);
  // clone objects
  queue.readyResources = produce(queue.resources, draftState => draftState);
  queue.readyComponentResources = produce(
      queue.componentResources,
      draftState => draftState
  );
  document.addEventListener('packageLoaded', e => {
    for (const reqKey in queue.requests) {
      if (e.detail.path === queue.requests[reqKey].path) {
        queue.requests = produce(queue.requests, draftState => {
          draftState[reqKey].fetch = 'done';
        });
        break;
      }
    }
    // loop through packages of components
    for (const pkgKey in queue.readyComponentResources) {
      const pkg = queue.readyComponentResources[pkgKey];
      if (pkg.dependsOn && pkg.dependsOn.length > 0) {
        const index = pkg.dependsOn.indexOf(e.detail.path);
        if (index > -1) {
          queue.readyComponentResources = produce(
              queue.readyComponentResources,
              draftState => {
                draftState[pkgKey].dependsOn.splice(index, 1);
              }
          );
          const updatedPkg = queue.readyComponentResources[pkgKey];
          if (updatedPkg.dependsOn.length === 0) {
            getPackages(addToQueue([updatedPkg]), true);
          }
        }
      } else {
        const index = pkg.paths.indexOf(e.detail.path);
        if (index > -1) {
          queue.readyComponentResources = produce(
              queue.readyComponentResources,
              draftState => {
                draftState[pkgKey].paths.splice(index, 1);
              }
          );
          const updatedPkg = queue.readyComponentResources[pkgKey];
          if (updatedPkg.paths.length === 0) {
            queue.readyResources = updateComponentResources(
                queue.readyResources,
                pkg
            );
          }
        }
      }
    }
  });
  let counter = 0;
  document.addEventListener('componentReady', e => {
    console.log(`component with id: ${e.detail} ready`);
    counter = counter + 1;
    if (counter === queue.readyResources.length) {
      const ev = new CustomEvent('resourcesReady');
      document.dispatchEvent(ev);
    }
  });
  document.addEventListener('resourcesReady', e => {
    console.log('all resources loaded');
  });
};

const getStatus = () => queue;

const update = container => {
  // ☕ Merging all
  queue.resources = getResourcesFromDOM(container, options, queue.resources);
  // 🤞 check again
  checkDependencies(queue.resources);
  // update component resources
  queue.componentResources = getComponentResources(queue.resources);
  console.log(queue.requests);
  queue.requests = addToQueue(queue.componentResources, queue.requests);
  console.log(queue.requests);
  // ⚠️ thats not gonna work ✌️ we need to first uncheck all already loaded stuff
  // 🎆 fire events

  getPackages(queue.requests);
  // getPackages(newRequests);
};

export { getStatus, update, init };

export default init;
