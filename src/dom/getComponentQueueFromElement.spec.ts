import { HTMLComponentDefinition } from './../types';
import { ComponentDefinition } from '../types';
import getComponentQueueFromElement from './getComponentQueueFromElement';
import { defaultOptions } from '../defaultOptions';

describe('#getComponentQueueFromElement', () => {

    test('returns empty array for undefined', () => {
        const componentQueue = getComponentQueueFromElement(undefined, defaultOptions.resourceListAtrributeSelector);
        expect(componentQueue).toHaveLength(0);
    });

    describe('provided with element', () => {
        test('returns empty array for non existent components', () => {
            const componentQueue = getComponentQueueFromElement(document.createElement('div'), defaultOptions.resourceListAtrributeSelector);

            expect(componentQueue).toHaveLength(0);
        });

        test('returns all component queues in container', () => {
            const container = document.createElement('div');
            container.innerHTML = `<div data-resources="[{paths: []}]"></div>`;
            const componentQueue = getComponentQueueFromElement(container.children.item(0) as HTMLElement, defaultOptions.resourceListAtrributeSelector);

            expect(componentQueue).toHaveLength(1);
        });

        test('returns queues in container with custom attribute selector for queue', () => {
            const container = document.createElement('div');
            const customSelectorForQueue = 'arbitrary';
            container.innerHTML = `<div ${customSelectorForQueue}="[{paths: []}]"></div>`;
            const componentQueue = getComponentQueueFromElement(container.children.item(0) as HTMLElement, customSelectorForQueue);

            expect(componentQueue).toHaveLength(1);
        });

        describe('the return value', () => {
            test('has paths set correctly', () => {
                const container = document.createElement('div');
                const paths = ['Hallo Welt'];
                container.innerHTML = `<div data-resources='[{paths: ${JSON.stringify(paths)}}]'></div>`;
                const componentDefinitions: HTMLComponentDefinition[] = getComponentQueueFromElement(container.children.item(0) as HTMLElement, defaultOptions.resourceListAtrributeSelector);

                expect(componentDefinitions[0].paths).toEqual(paths);
            });

            test('has element set correctly', () => {
                const container = document.createElement('div');
                const paths = ['Hallo Welt'];
                container.innerHTML = `<div data-resources='[{paths: ${JSON.stringify(paths)}}]'></div>`;
                const componentDefinitions: HTMLComponentDefinition[] = getComponentQueueFromElement(container.children.item(0) as HTMLElement, defaultOptions.resourceListAtrributeSelector);

                expect(componentDefinitions[0].element).toEqual(container.children.item(0));
            });
        });
    });
})
