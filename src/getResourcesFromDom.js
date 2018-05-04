import produce from 'immer';
import random from './randomId';

function getOrigin() {
  if (!window.location.origin) {
    return (window.location.origin =
			window.location.protocol +
			'//' +
			window.location.hostname +
			(window.location.port ? ':' + window.location.port : ''));
  }
  return window.location.origin;
}

function absolutePath(urlString) {
  let normalizedUrl;
  const absoluteReg = new RegExp('^(?:[a-z]+:)?//', 'i');

  if (absoluteReg.test(urlString)) {
    // is absolute
    normalizedUrl = urlString;
  } else {
    if (urlString.indexOf('/') === 0 && urlString.indexOf('//') !== 0) {
      normalizedUrl = getOrigin() + urlString;
    } else {
      const paths = window.location.pathname.split('/');
      paths.pop();
      normalizedUrl = getOrigin() + paths.join('/') + '/' + urlString;
    }
  }
  return normalizedUrl;
}

function getPath(path, resource, options) {
  const pathIsRelative =
		path.indexOf('http://') === -1 &&
		path.indexOf('https://') === -1 &&
		path.charAt(0) !== '/';

  // resolve relative paths
  if (pathIsRelative) {
    if (resource.base) {
      if (resource.base.substring(0, 2) === '##')
        resource.base = options.baseMap[resource.base];

      path = resource.base + path;
    } else if (options && options.base) {
      path = options.base + path;
    }
  }
  // create unique absolute path
  const normalizedPath = absolutePath(path);

  return normalizedPath;
}

// not really deep equal, more tailored to the needs of resourceLoader
const deepEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (const key in a) {
    const aa = a[key];
    const bb = b[key];

    if (
      aa.paths.length !== bb.paths.length &&
			aa.dependsOn.length !== bb.dependsOn.length
    )
      return false;
    for (const dependsKey in aa.dependsOn) {
      if (aa.dependsOn[dependsKey] !== bb.dependsOn[dependsKey]) return false;
    }
    for (const pathKey in aa.paths) {
      if (aa.paths[pathKey] !== bb.paths[pathKey]) return false;
    }
  }
  return true;
};

const getResourcesFromDOM = (selector, options, resources = []) => {
  // Array of HTML elements with a dataset "resources"
  let domResources = null;
  // if no selector is specified the scope is the whole document
  if (selector !== '') {
    let container = null;
    if (typeof selector !== 'object') {
      container = document.querySelector(selector);
    } else {
      container = selector;
    }
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
      resources = produce(resources, draftState => {
        draftState.push(obj);
      });
    }
  }
  return resources;
};

export default getResourcesFromDOM;
