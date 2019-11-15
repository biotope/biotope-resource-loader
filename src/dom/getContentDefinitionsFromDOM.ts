import { HTMLComponentDefinition } from '../types';
import getResourceElements from './getResourceElements';
import getComponentQueueFromElement from './getComponentQueueFromElement';
import unnest from '../fp/unnest';

const getContentDefinitionsFromDOM = (container: ParentNode = document, resourceListAtrributeSelector: string): HTMLComponentDefinition[] => {
  const domResources: HTMLElement[] = getResourceElements(container, resourceListAtrributeSelector);
  return unnest(domResources.map((element) => getComponentQueueFromElement(element, resourceListAtrributeSelector)));
};

export default getContentDefinitionsFromDOM;
