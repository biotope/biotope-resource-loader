/**
 * VI Resource Loader v1.3.0
 * For documentation see:
 * https://github.com/biotope/biotope-resource-loader
 */

import produce from 'immer';
import './polyfill';

import getPackages from './getPackages';
import getResourcesFromDOM from './getResourcesFromDom';

const checkDependencies = resources => {
  const allPaths = [];
  const dependencies = [];
  // loop over resources object
  for (const resource of resources) {
    // take every resource object and loop over it's path's
    for (const paths of resource.resources) {
      // add path to allPaths
      for (const path of paths.paths) {
        allPaths.push(path);
      }
      // if has a dependency add it
      if (paths.dependsOn) {
        for (const dependency of paths.dependsOn) {
          dependencies.push(dependency);
        }
      }
    }
  }
  // check if dependencies are resolvable
  for (const dependency of dependencies) {
    if (allPaths.indexOf(dependency) === -1) {
      console.error(`⚠️ ERROR ${dependency} not resolvable.`);
    }
  }
};

const checkDependency = (dependents, requests) => {
  for (const d of dependents) {
    const result = requests.find(r => r.path === d);
    if (result === undefined) {
      // not all dependencies are lined up
      return false;
    }
  }
  // all dependencies are lined up
  return true;
};

const uniquePath = (requests, path, hasDependencies, sourceId, id) => {
  let req = requests;
  const result = req.findIndex(req => req.path === path);
  if (result === -1) {
    req = produce(req, draftState => {
      draftState.push({
        path,
        hasDependencies,
        sourceIds: [sourceId],
        packageIds: [id]
      });
    });
  } else {
    req = produce(req, draftState => {
      draftState[result].sourceIds.push(sourceId);
      draftState[result].packageIds.push(id);
    });
  }
  return req;
};

const addToQueue = (componentResources, requests = [], counter = 0) => {
  // recursive function to get load order
  let req = requests;
  const el = componentResources[0];
  let arr = componentResources;
  let i = counter; // counter counts up every unsuccessful reordering and resets itself on success.
  // if first element has depndecies and dependencies are not in load order yet and the total length of the array is greater/equal to 2 + counter
  if (
    el.dependsOn &&
		checkDependency(el.dependsOn, req) === false &&
		arr.length >= 2 + counter
  ) {
    i = i + 1; // counter get up
    const current = arr[0];
    const next = arr[i];
    arr = produce(arr, draftState => {
      draftState[0] = next;
      draftState[i] = current;
    });
  } else {
    // first item get's removed
    arr = produce(arr, draftState => {
      draftState.splice(0, 1);
    });
    // reset counter
    i = 0;
    let hasDependencies = false;
    if (el.dependsOn && el.dependsOn.length > 0) {
      hasDependencies = true;
    }
    // push all paths
    for (const p of el.paths) {
      req = uniquePath(req, p, hasDependencies, el.sourceId, el.id);
    }
  }
  // if array not empty go for it again 🏃‍
  if (arr.length !== 0) {
    return addToQueue(arr, req, i);
  } else {
    // return ordered requests.
    return req;
  }
};

function getComponentResources(resources) {
  let flatten = [];
  for (const resource of resources) {
    for (const componentResource of resource.resources) {
      const componentResourceClone = Object.assign({}, componentResource);
      componentResourceClone.sourceId = resource.id;
      flatten = produce(flatten, draftState => {
        draftState.push(componentResourceClone);
      });
    }
  }
  return flatten;
}

const updateComponentResources = (readyResources, pkg) => {
  let ready = produce(readyResources, draftState => draftState);
  for (const readyComponentPkg in ready) {
    const { id, resources } = ready[readyComponentPkg];
    if (id === pkg.sourceId) {
      for (const pkgKey in resources) {
        if (pkg.id === resources[pkgKey].id) {
          ready = produce(ready, draftState => {
            draftState[readyComponentPkg].resources.splice(pkgKey, 1);
          });
          const updatedResources = ready[readyComponentPkg].resources;
          if (updatedResources.length === 0) {
            const e = new CustomEvent('componentReady', { detail: id });
            document.dispatchEvent(e);
          }
        }
      }
    }
  }
  return ready;
};

let debug = null;

const defaults = {
  container: '', // css selector for document.querySelector
  readyEvent: 'resourcesReady' // needs to be a string
};

let resources = [];

// global options
let options = null;

const resourceLoader = customOptions => {
  options = Object.assign({}, defaults, customOptions);
  debug = options.debug ? options.debug : true;

  resources = getResourcesFromDOM(options.container, options);
  // 👷‍ add resources from options
  // ⚠️ that could be buggy, or at least it will not fire any events atm
  if (options.resources) {
    resources.unshift({ resources: options.resources });
  }

  checkDependencies(resources);

  const componentResources = getComponentResources(resources);
  const requests = addToQueue(componentResources);
  getPackages(requests);
  console.log(requests);
  // clone objects
  let readyResources = produce(resources, draftState => draftState);
  let readyComponentResources = produce(
      componentResources,
      draftState => draftState
  );
  document.addEventListener('packageLoaded', e => {
    // loop through packages of components
    for (const pkgKey in readyComponentResources) {
      const pkg = readyComponentResources[pkgKey];
      if (pkg.dependsOn && pkg.dependsOn.length > 0) {
        const index = pkg.dependsOn.indexOf(e.detail.path);
        if (index > -1) {
          readyComponentResources = produce(
              readyComponentResources,
              draftState => {
                draftState[pkgKey].dependsOn.splice(index, 1);
              }
          );
          const updatedPkg = readyComponentResources[pkgKey];
          if (updatedPkg.dependsOn.length === 0) {
            getPackages(addToQueue([updatedPkg]), true);
          }
        }
      } else {
        const index = pkg.paths.indexOf(e.detail.path);
        if (index > -1) {
          readyComponentResources = produce(
              readyComponentResources,
              draftState => {
                draftState[pkgKey].paths.splice(index, 1);
              }
          );
          const updatedPkg = readyComponentResources[pkgKey];
          if (updatedPkg.paths.length === 0) {
            readyResources = updateComponentResources(readyResources, pkg);
          }
        }
      }
    }
  });
  let counter = 0;
  document.addEventListener('componentReady', e => {
    console.log(`component with id: ${e.detail} ready`);
    counter = counter + 1;
    if (counter === readyResources.length) {
      const ev = new CustomEvent('resourcesReady');
      document.dispatchEvent(ev);
    }
  });
  document.addEventListener('resourcesReady', e => {
    console.log('all resources loaded');
  });
};

export default resourceLoader;
