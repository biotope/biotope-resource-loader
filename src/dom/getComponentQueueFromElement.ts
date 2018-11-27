import { pipe, defaultTo } from 'ramda';
import getDataResourceFromElement from './getDataResourceFromElement';
import { ComponentDefinition } from '../types';

const getComponentQueueFromElement = pipe<HTMLElement, HTMLElement, string, ComponentDefinition[], ComponentDefinition[]>(
    defaultTo<HTMLElement>(document.createElement('div')),
    getDataResourceFromElement,
    eval,
    defaultTo([])
);

export default getComponentQueueFromElement;
