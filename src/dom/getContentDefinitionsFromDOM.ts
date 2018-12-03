import { HTMLComponentDefinition } from '../types';
import getResourceElements from './getResourceElements';
import getComponentQueueFromElement from './getComponentQueueFromElement';
import unnest from '../fp/unnest';

const getContentDefinitionsFromDOM = (container: ParentNode = document): HTMLComponentDefinition[] => {
  const domResources: HTMLElement[] = getResourceElements(container);

  return unnest(domResources.map(getComponentQueueFromElement));
};

export default getContentDefinitionsFromDOM;
