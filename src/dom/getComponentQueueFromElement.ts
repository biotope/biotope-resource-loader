import { HTMLComponentDefinition } from './../types';
import getDataResourceFromElement from './getDataResourceFromElement';
import { ComponentDefinition } from '../types';

const getComponentQueueFromElement = (element: HTMLElement = document.createElement('div'), resourceListAtrributeSelector: string): HTMLComponentDefinition[] => {
    const dataResources: string = getDataResourceFromElement(element, resourceListAtrributeSelector);
    const definitions: ComponentDefinition[] = eval(dataResources) || [];

    return definitions.map((d: ComponentDefinition): HTMLComponentDefinition => ({
        ...d,
        element
    }));
}

export default getComponentQueueFromElement;
