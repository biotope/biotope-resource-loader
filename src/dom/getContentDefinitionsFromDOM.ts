import { HTMLComponentDefinition } from '../types';
import { unnest } from 'ramda';
import getResourceElements from './getResourceElements';
import getComponentQueueFromElement from './getComponentQueueFromElement';

const getContentDefinitionsFromDOM = (container: ParentNode = document): HTMLComponentDefinition[] => {
  const domResources: HTMLElement[] = getResourceElements(container);

  return unnest(domResources.map(getComponentQueueFromElement))
};

export default getContentDefinitionsFromDOM;
