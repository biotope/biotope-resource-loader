import { ResourceDefinition } from './types';
/**
 * VI Resource Loader v1.3.0
 * For documentation see:
 * https://github.com/biotope/biotope-resource-loader
 */

import produce from 'immer';
import './polyfill';

import getPackages from './getPackages';
import getQueuesFromDOM from './getResourcesFromDom';
import checkDependencies from './checkDependencies';
import addToQueue from './addToQueue';
import {
  getDefinitionsFromQueues,
  updateComponentResources
} from './componentResources';
import { ResourceLoaderOptions, ResourceQueue } from './types';

const defaults: ResourceLoaderOptions = {
  container: '', // css selector for document.querySelector
  readyEvent: 'resourcesReady' // needs to be a string
};

// global options
let options: ResourceLoaderOptions = null;

const queue: {
  definitions: ResourceQueue[],
  componentResources: ResourceDefinition[]
} = {
  definitions: [],
  componentResources: []
};


const init = (customOptions: ResourceLoaderOptions) => {
  options = {
    ...defaults,
    ...customOptions
  };
  // debug = options.debug ? options.debug : true;

  queue.definitions = getQueuesFromDOM(document.querySelector(options.container), options);
  // 👷‍ add resources from options
  // ⚠️ that could be buggy, or at least it will not fire any events atm
  if (options.resources) {
    queue.definitions.unshift({ definition: options.resources });
  }

  checkDependencies(queue.definitions);

  queue.componentResources = getDefinitionsFromQueues(queue.definitions);
  queue.requests = addToQueue(queue.componentResources);
  getPackages(queue.requests);
  // clone objects
  queue.readyResources = produce(queue.definitions, draftState => draftState);
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
  document.addEventListener('componentReady', (e: CustomEvent) => {
    console.log(`component with id: ${e.detail} ready`);
    counter = counter + 1;
    if (counter === queue.readyResources.length) {
      const ev = new CustomEvent(options.readyEvent);
      document.dispatchEvent(ev);
    }
  });
  document.addEventListener(options.readyEvent, (e: CustomEvent) => {
    console.log('all resources loaded');
  });
};

const getStatus = () => queue;

const update = container => {
  // ☕ Merging all
  queue.definitions = getQueuesFromDOM(container, options, queue);
  // 🤞 check again
  checkDependencies(queue.definitions);
  // update component resources
  queue.componentResources = getDefinitionsFromQueues(queue.definitions);
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
