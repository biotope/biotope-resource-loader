import { HTMLComponentDefinition } from './../types';
import getDataResourceFromElement from './getDataResourceFromElement';
import { ComponentDefinition } from '../types';

const getComponentQueueFromElement = (element: HTMLElement = document.createElement('div')): HTMLComponentDefinition[] => {
    const dataResources: string = getDataResourceFromElement(element);
    const definitions: ComponentDefinition[] = eval(dataResources) || [];

    return definitions.map((d: ComponentDefinition): HTMLComponentDefinition => ({
        ...d,
        element
    }));
}

export default getComponentQueueFromElement;
