import produce from 'immer';
import { ResourceDefinition, ResourceLoaderOptions, ResourceQueue } from './types';
import queuesAreEqual from './queuesAreEqual';
import makeRandomId from './makeRandomId';
import getResourceElements from './getResourceElements';
import prepareDefinition from './prepareDefinition';

const getQueuesFromDOM = (container: ParentNode = document, options: ResourceLoaderOptions, existentQueues: ResourceQueue[] = []): ResourceQueue[] => {
  const domResources: HTMLElement[] = getResourceElements(container);

  //for every data-resource element
  for (const newResource of domResources) {
    //get the definitions
    const definitions: ResourceDefinition[] = eval(newResource.dataset.resources);
    const queue: ResourceQueue = {
      id: makeRandomId(),
      definitions: definitions.map(prepareDefinition)
    };

    let isNew = true;
    // find duplicates 👭
    for (const resourceQueue of existentQueues) {
      if (queuesAreEqual(resourceQueue, queue)) {
        // if not new set to false, add class and break => return undefined
        newResource.classList.add(`resourceLoader-${resourceQueue.id}`);
        isNew = false;
        break;
      }
    }
    if (isNew) {
      newResource.classList.add(`resourceLoader-${queue.id}`);
      existentQueues = produce(existentQueues, draftState => {
        draftState.push(queue);
      });
    }
  }


  return existentQueues;
};

export default getQueuesFromDOM;
