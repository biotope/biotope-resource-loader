import produce from 'immer';
import random from './randomId';
import toAbsolutePath from './toAbsolutePath';
import resolveBaseWith from './resolveBaseWith';
import { ResourceDefinition, ResourceLoaderOptions } from './types';
import queuesAreEqual from './queuesAreEqual';

function getPath(path, resource, options) {
  const pathIsRelative =
    path.indexOf('http://') === -1 &&
    path.indexOf('https://') === -1 &&
    path.charAt(0) !== '/';

  // resolve relative paths
  if (pathIsRelative) {
    if (resource.base) {
      const resolveBase = resolveBaseWith(options.baseMap);

      return toAbsolutePath(resolveBase(resource.base) + path);
    } else if (options && options.base) {
      return toAbsolutePath(options.base + path);
    }
  }
  return toAbsolutePath(path);
}

const getResourcesFromDOM = (container: ParentNode = document, options: ResourceLoaderOptions, resources = []) => {
  // Array of HTML elements with a dataset "resources"
  let domResources: HTMLElement[] = null;
  // if no selector is specified the scope is the whole document
  domResources = [].slice.call(container.querySelectorAll('[data-resources]'));

  for (const newResource of domResources) {
    const obj: any = {};
    // evaluating data attribute string
    const definitions: ResourceDefinition[] = eval(newResource.dataset.resources);
    obj.resources = definitions;
    // normalize path

    definitions
      .map((definition: ResourceDefinition) => ({ ...definition, id: random }))
      .map((definition: ResourceDefinition) => ({
        ...definition,
        paths: definition.paths.map((path) => getPath(path, definition, options))
      }))
      .map((definition: ResourceDefinition) => ({
        ...definition,
        dependsOn: []
      }))

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
        if (queuesAreEqual(resource, obj)) {
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
