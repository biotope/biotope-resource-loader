import { HTMLComponentDefinition } from './../types';
import getDataResourceFromElement from './getDataResourceFromElement';
import { ComponentDefinition } from '../types';
import { defaultOptions } from '../defaultOptions';

const getComponentQueueFromElement = (element: HTMLElement = document.createElement('div'), resourceListAtrributeSelector: string = defaultOptions.resourceListAtrributeSelector): HTMLComponentDefinition[] => {
    const dataResources: string = getDataResourceFromElement(element, resourceListAtrributeSelector);
    const definitions: ComponentDefinition[] = eval(dataResources) || [];

    return definitions.map((d: ComponentDefinition): HTMLComponentDefinition => ({
        ...d,
        element
    }));
}

export default getComponentQueueFromElement;
