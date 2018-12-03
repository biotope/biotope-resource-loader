import { Resource } from './types';
import EVENTS from './Events';

const loadResource = (resource: Resource): Promise<any> => {
  return fetch(resource.path).then((response: Response) => {
    const e: CustomEvent<{ resource: Resource, response: Response }> = new CustomEvent(EVENTS.RESOURCE_LOADED, {
      detail: {
        resource,
        response
      }
    });
    document.dispatchEvent(e);
  });
};

const loadResources = (resources: Resource[]): Promise<any>[] => resources.map(loadResource);

export default loadResources;
