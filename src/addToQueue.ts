import { FETCH_STATUS } from './constants/FetchStatus';
import produce from 'immer';
import alreadyRegistered from './alreadyRegistered';
import hasDependencies from './helper/hasDependencies';
import { IdentifiableResourceDefinition, Resource } from './types/internal';
import { tail } from 'ramda';

const ensureUniquePaths = (resources: Resource[], definition: IdentifiableResourceDefinition): Resource[] => {
  let currentQueue = [...resources];
  for (const path of definition.paths) {
    const index = currentQueue.findIndex(req => req.path === path);
    if (index === -1) {
      currentQueue = [
        ...currentQueue,
        {
          path,
          hasDependencies: hasDependencies(definition),
          sourceIds: [definition.sourceId],
          componentIds: [definition.id],
          fetchStatus: FETCH_STATUS.PENDING
        }
      ];
    } else {
      currentQueue = produce(currentQueue, draftState => {
        draftState[index].sourceIds.push(definition.sourceId);
        draftState[index].componentIds.push(definition.id);
      });
    }
  }

  return currentQueue;
};

const swap = (arr: any[], i, j) => {
  const temp = [...arr];
  temp[i] = arr[j];
  temp[j] = arr[i];

  return temp;
}

const addToQueue = (resourceDefinitions: IdentifiableResourceDefinition[] = [], queuedResources: Resource[] = [], counter: number = 0): Resource[] => {

  if (!resourceDefinitions.length) {
    return queuedResources;
  }

  let currentQueue = queuedResources;
  const currentDefinition: IdentifiableResourceDefinition = resourceDefinitions[0];
  let tempResourceDefinitions;
  let i = counter;

  if (
    hasDependencies(currentDefinition) &&
    !alreadyRegistered(currentDefinition.dependsOn, queuedResources) &&
    resourceDefinitions.length >= 2 + counter
  ) {
    i++; // counter get up
    // ⚠️ TODO: This creates unnessecary loops!!!!!!
    tempResourceDefinitions = swap(resourceDefinitions, 0, i);
  } else {
    tempResourceDefinitions = tail(resourceDefinitions);
    i = 0;

    currentQueue = ensureUniquePaths(currentQueue, currentDefinition);
  }



  // if array not empty go for it again 🏃‍
  if (tempResourceDefinitions.length !== 0) {
    return addToQueue(tempResourceDefinitions, currentQueue, i);
  } else {
    // return ordered requests.
    return currentQueue;
  }
};

export default addToQueue;
