import { HTMLComponentDefinition } from '../types';
import getResourceElements from './getResourceElements';
import getComponentQueueFromElement from './getComponentQueueFromElement';
import unnest from '../fp/unnest';

const getContentDefinitionsFromDOM = (container: ParentNode = document, resourceListAttributeSelector: string): HTMLComponentDefinition[] => {
  const domResources: HTMLElement[] = getResourceElements(container, resourceListAttributeSelector);
  return unnest(domResources.map((element) => getComponentQueueFromElement(element, resourceListAttributeSelector)));
};

export default getContentDefinitionsFromDOM;
