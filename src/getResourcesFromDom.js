import deepEqual from './deepEqual';
import produce from 'immer';
import random from './randomId';
import getPath from './getPath';

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
