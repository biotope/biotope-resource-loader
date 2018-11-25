import getDataResourceFromElement from './getDataResourceFromElement';

describe('#getDataResourceFromElement', () => {

    test('returns empty string for undefined', () => {
        const componentQueues = getDataResourceFromElement(undefined);
        expect(componentQueues).toBe('');
    });

    test('returns empty string for non existent resource', () => {
        const componentQueues = getDataResourceFromElement(document.createElement('div'));
        expect(componentQueues).toBe('');
    });

    test('returns data resource string', () => {
        const container = document.createElement('div');
        container.innerHTML = `<div data-resources="[{paths: []}]"></div>`;
        const element = container.children.item(0) as HTMLElement;
        const componentQueues = getDataResourceFromElement(element);
        expect(componentQueues).toBe('[{paths: []}]');
    });
})
