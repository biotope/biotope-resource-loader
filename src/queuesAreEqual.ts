import { ResourceQueue, ResourceDefinition } from './types';
import { getDefaultQueue } from './ResourceQueueBuilder';
import definitionsAreEqual from './definitionsAreEqual';

const queuesAreEqual = (queue1: ResourceQueue = getDefaultQueue(), queue2: ResourceQueue = getDefaultQueue()) => {
    const definitions1 = queue1.definitions;
    const definitions2 = queue2.definitions;
    return definitions1.length == definitions2.length
        && definitions1.every((entry: ResourceDefinition, index) => definitionsAreEqual(entry, definitions2[index]));
}

export default queuesAreEqual;
