import { HTMLComponentDefinition } from './../types';
import getDataResourceFromElement from './getDataResourceFromElement';
import { ComponentDefinition } from '../types';
import { defaultOptions } from '../defaultOptions';

const getComponentQueueFromElement = (element: HTMLElement = document.createElement('div'), resourceListAttributeSelector: string = defaultOptions.resourceListAttributeSelector): HTMLComponentDefinition[] => {
    const dataResources: string = getDataResourceFromElement(element, resourceListAttributeSelector);
    const definitions: ComponentDefinition[] = eval(dataResources) || [];

    return definitions.map((d: ComponentDefinition): HTMLComponentDefinition => ({
        ...d,
        element
    }));
}

export default getComponentQueueFromElement;
