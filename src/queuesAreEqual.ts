import { IdentifiableComponentQueue } from './types/internal';
import { ResourceDefinition } from './types/external';
import { getDefaultQueue } from './builders/IdentifiableComponentQueueBuilder';
import definitionsAreEqual from './definitionsAreEqual';

const queuesAreEqual = (queue1: IdentifiableComponentQueue = getDefaultQueue(), queue2: IdentifiableComponentQueue = getDefaultQueue()) => {
    const definitions1 = queue1.definitions;
    const definitions2 = queue2.definitions;
    return definitions1.length == definitions2.length
        && definitions1.every((entry: ResourceDefinition, index) => definitionsAreEqual(entry, definitions2[index]));
}

export default queuesAreEqual;
