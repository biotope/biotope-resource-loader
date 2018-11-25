import { pipe, defaultTo } from 'ramda';
import { ComponentQueue } from '../types/external';
import getDataResourceFromElement from './getDataResourceFromElement';

const getComponentQueueFromElement = pipe<HTMLElement, HTMLElement, string, ComponentQueue, ComponentQueue>(
    defaultTo<HTMLElement>(document.createElement('div')),
    getDataResourceFromElement,
    eval,
    defaultTo([])
);

export default getComponentQueueFromElement;
