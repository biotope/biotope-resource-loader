import { pipe, map } from 'ramda';
import getResourceElements from './dom/getResourceElements';
import { ComponentQueue } from './types/external';
import getDataResourceFromElement from './dom/getDataResourceFromElement';
import getComponentQueueFromElement from './dom/getComponentQueueFromElement';

const getComponentQueuesIn = pipe<ParentNode, HTMLElement[], ComponentQueue[]>(
    getResourceElements,
    map(getComponentQueueFromElement)
);

export default getComponentQueuesIn;
