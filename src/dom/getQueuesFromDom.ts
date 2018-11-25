import { IdentifiableComponentQueue } from '../types/internal';
import makeRandomId from '../makeRandomId';
import getResourceElements from './getResourceElements';
import prepareDefinition from '../prepareDefinition';
import getComponentQueueFromElement from './getComponentQueueFromElement';

const getQueuesFromDOM = (container: ParentNode = document): IdentifiableComponentQueue[] => {
  const domResources: HTMLElement[] = getResourceElements(container);

  return domResources.map((dr) => ({
    id: makeRandomId(),
    definitions: getComponentQueueFromElement(dr).map(prepareDefinition)
  }));
};

export default getQueuesFromDOM;
