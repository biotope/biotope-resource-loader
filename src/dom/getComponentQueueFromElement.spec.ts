import { ComponentQueue } from '../types/external';
import getComponentQueueFromElement from './getComponentQueueFromElement';

describe('#getComponentQueueFromElement', () => {

    test('returns empty array for undefined', () => {
        const componentQueue = getComponentQueueFromElement(undefined);
        expect(componentQueue).toHaveLength(0);
    });

    describe('provided with element', () => {
        test('returns empty array for non existen components', () => {
            const componentQueue = getComponentQueueFromElement(document.createElement('div'));

            expect(componentQueue).toHaveLength(0);
        });

        test('returns all component queues in container', () => {
            const container = document.createElement('div');
            container.innerHTML = `<div data-resources="[{paths: []}]"></div>`;
            const componentQueue = getComponentQueueFromElement(container.children.item(0) as HTMLElement);

            expect(componentQueue).toHaveLength(1);
        });

        describe('the return value', () => {
            test('has paths set correctly', () => {
                const container = document.createElement('div');
                const paths = ['Hallo Welt'];
                container.innerHTML = `<div data-resources='[{paths: ${JSON.stringify(paths)}}]'></div>`;
                const componentQueues: ComponentQueue = getComponentQueueFromElement(container.children.item(0) as HTMLElement);

                expect(componentQueues[0].paths).toEqual(paths);
            });
        });
    });
})
