import getDataResourceFromElement from './getDataResourceFromElement';
import { defaultOptions } from '../defaultOptions';

describe('#getDataResourceFromElement', () => {

    test('returns empty string for undefined', () => {
        const componentQueues = getDataResourceFromElement(undefined, defaultOptions.resourceListAtrributeSelector);
        expect(componentQueues).toBe('');
    });

    test('returns empty string for non existent resource', () => {
        const componentQueues = getDataResourceFromElement(document.createElement('div'), defaultOptions.resourceListAtrributeSelector);
        expect(componentQueues).toBe('');
    });

    test('returns data-resource attribute string', () => {
        const container = document.createElement('div');
        container.innerHTML = `<div data-resources="[{paths: []}]"></div>`;
        const element = container.children.item(0) as HTMLElement;
        const componentQueues = getDataResourceFromElement(element, defaultOptions.resourceListAtrributeSelector);
        expect(componentQueues).toBe('[{paths: []}]');
    });

    test('returns custom resource list attribute string', () => {
        const container = document.createElement('div');
        const customAttribute = 'arbitrary';
        container.innerHTML = `<div ${customAttribute}="[{paths: []}]"></div>`;
        const element = container.children.item(0) as HTMLElement;
        const componentQueues = getDataResourceFromElement(element, customAttribute);
        expect(componentQueues).toBe('[{paths: []}]');
    });
})
