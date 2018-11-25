import { pipe, defaultTo, prop } from 'ramda';

const getDataResourceFromElement = pipe<HTMLElement, HTMLElement, DOMStringMap, string, string>(
    defaultTo<HTMLElement>(document.createElement('div')),
    prop('dataset'),
    prop('resources'),
    defaultTo('')
)

export default getDataResourceFromElement;
