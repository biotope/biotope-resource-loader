import { Resource } from './types';
import EVENTS from './Events';

const loadResource = (resource: Resource): Promise<any> => {
  return fetch(resource.path).then(() => {
    const e: CustomEvent<Resource> = new CustomEvent(EVENTS.RESOURCE_LOADED, { detail: resource });
    document.dispatchEvent(e);
  });
};

const loadResources = (resources: Resource[]): Promise<any>[] => resources.map(loadResource);

export default loadResources;
