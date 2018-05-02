/**
 * VI Resource Loader v1.3.0
 * For documentation see:
 * https://github.com/biotope/biotope-resource-loader
 */

import deepEqual from 'deep-equal';
import './polyfill';

import random from './randomId';
import getPath from './getPath';

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
  const r = requests;
  const result = requests.findIndex(r => r.path === path);
  if (result === -1) {
    r.push({ path, hasDependencies, sourceIds: [sourceId], packageIds: [id] });
  } else {
    r[result].sourceIds.push(sourceId);
    r[result].packageIds.push(id);
  }
  return r;
};

const recurse = (arr, requests, counter = 0) => {
  // recursive function to get load order
  let req = requests;
  const el = arr[0];
  const arra = arr;
  let i = counter; // counter counts up every unsuccessful reordering and resets itself on success.
  // if first element has depndecies and dependencies are not in load order yet and the total length of the array is greater/equal to 2 + counter
  if (
    el.dependsOn &&
		checkDependency(el.dependsOn, req) === false &&
		arra.length >= 2 + counter
  ) {
    i = i + 1; // counter get up
    const current = arr[0];
    const next = arr[i];
    arra[0] = next;
    arra[i] = current;
  } else {
    // first item get's removed
    arra.splice(0, 1);
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
  if (arra.length !== 0) {
    return recurse(arr, req, i);
  } else {
    // return ordered requests.
    return req;
  }
};

const addToQueue = arr => {
  const requests = [];
  return recurse(arr, requests);
};

function flattenQueue(resources) {
  const flatten = [];
  for (const resourceTree of resources) {
    for (const ast of resourceTree.resources) {
      ast.sourceId = resourceTree.id;
      flatten.push(ast);
    }
  }
  return flatten;
}

const getResourcesFromDOM = (selector, options) => {
  // thats an array of all resources found in the dom
  const resources = [];
  // Array of HTML elements with a dataset "resources"
  let domResources = null;
  // if no selector is specified the scope is the whole document
  if (selector !== '') {
    const container = document.querySelector(selector);
    domResources = [].slice.call(
        container.querySelectorAll('[data-resources]')
    );
  } else {
    domResources = [].slice.call(document.querySelectorAll('[data-resources]'));
  }
  for (const newResource of domResources) {
    const obj = {};
    // evaluating data attribute string
    obj.resources = eval(newResource.dataset.resources);
    // normalize path
    for (const key in obj.resources) {
      const resourceObj = obj.resources[key];
      resourceObj.id = random();
      for (const pathKey in resourceObj.paths) {
        const path = resourceObj.paths[pathKey];
        obj.resources[key].paths[pathKey];
        obj.resources[key].paths[pathKey] = getPath(path, resourceObj, options);
      }
      if (resourceObj.dependsOn) {
        for (const dependsOnKey in resourceObj.dependsOn) {
          const path = resourceObj.dependsOn[dependsOnKey];
          obj.resources[key].dependsOn[dependsOnKey] = getPath(
              path,
              resourceObj,
              options
          );
        }
      }
    }
    // resource or combination is new
    let isNew = true;
    // find duplicates 👭
    if (resources.length > 0) {
      for (const resource of resources) {
        // TODO ⚠️ Thats a bug right here because of unique ids
        if (deepEqual(resource.resources, obj.resources)) {
          // if not new set to false, add class and break
          newResource.classList.add(`resourceLoader-${resource.id}`);
          isNew = false;
          break;
        }
      }
    }
    if (isNew) {
      obj.id = random();
      newResource.classList.add(`resourceLoader-${obj.id}`);
      resources.push(obj);
    }
  }
  return resources;
};

const prewarmCache = path => {
  fetch(path);
};

const attachToDom = dependency => {
  const type = dependency.path.indexOf('.css') > -1 ? 'css' : 'js';
  if (type === 'css') {
    fetch(dependency.path).then(() => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.async = true;
      style.href = dependency.path;
      document.body.append(style);
      style.addEventListener('load', () => {
        // console.log('💅 style ready', style);
        const e = new CustomEvent('resourceLoaded', { detail: dependency });
        document.dispatchEvent(e);
      });
    });
  } else {
    const script = document.createElement('script');
    script.src = dependency.path;
    script.async = true;
    document.body.append(script);
    script.addEventListener('load', () => {
      // console.log('📖 script ready', script);
      const e = new CustomEvent('resourceLoaded', { detail: dependency });
      document.dispatchEvent(e);
    });
  }
};

const makeRequests = (urls, byPassCache = false) => {
  for (const url of urls) {
    if (url.hasDependencies && !byPassCache) {
      prewarmCache(url.path);
    } else {
      attachToDom(url);
    }
  }
};

const markAsDone = (readyResources, pkg) => {
  const ready = readyResources;
  const counter = 0;
  for (const readySource of ready) {
    const { id, resources } = readySource;
    if (id === pkg.sourceId) {
      for (const sourcePkgKey in resources) {
        if (pkg.id === resources[sourcePkgKey].id) {
          resources.splice(sourcePkgKey, 1);
          if (resources.length === 0) {
            const e = new CustomEvent('resourceReady', { detail: id });
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
  // 👷‍ add resources from options to queue
  if (options.resources) {
    resources.unshift({ resources: options.resources });
  }
  // collect data structures
  checkDependencies(resources);
  const whatever = flattenQueue(resources);
  const requests = addToQueue(whatever);
  makeRequests(requests);
  const packages = flattenQueue(resources);
  let readyResources = resources.slice(0);
  document.addEventListener('resourceLoaded', e => {
    for (const pkgKey in packages) {
      const pkg = packages[pkgKey];
      if (pkg.dependsOn && pkg.dependsOn.length > 0) {
        const index = pkg.dependsOn.indexOf(e.detail.path);
        if (index > -1) {
          pkg.dependsOn.splice(index, 1);
          if (pkg.dependsOn.length === 0) {
            makeRequests(addToQueue([pkg]), true);
          }
        }
      } else {
        const index = pkg.paths.indexOf(e.detail.path);
        if (index > -1) {
          pkg.paths.splice(index, 1);
          if (pkg.paths.length === 0) {
            readyResources = markAsDone(readyResources, pkg);
          }
        }
      }
    }
  });
  let counter = 0;
  document.addEventListener('resourceReady', e => {
    counter = counter + 1;
    if (counter === readyResources.length) {
      console.log('all done', options.readyEvent);
      const ev = new CustomEvent('resourcesReady');
      document.dispatchEvent(ev);
    }
  });
  document.addEventListener('resourcesReady', e => {
    console.log('all ok');
  });
};

export default resourceLoader;
