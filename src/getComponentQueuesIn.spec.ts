import { ComponentQueue } from './types/external';
import getComponentQueuesIn from './getComponentQueuesIn';

describe('#getComponentQueuesIn', () => {

    test('returns enmpty array for undefined', () => {
        const componentQueues = getComponentQueuesIn(undefined);
        expect(componentQueues).toHaveLength(0);
    });

    describe('provided with element', () => {
        test('returns empty array for non existen components', () => {
            const componentQueues = getComponentQueuesIn(document.createElement('div'));

            expect(componentQueues).toHaveLength(0);
        });

        test('returns all component queues in container', () => {
            const container = document.createElement('div');
            container.innerHTML = `<div data-resources="[{paths: []}]"></div>`;
            const componentQueues = getComponentQueuesIn(container);

            expect(componentQueues).toHaveLength(1);
        });

        describe('the return value', () => {
            test('has paths set correctly', () => {
                const container = document.createElement('div');
                const paths = ['Hallo Welt'];
                container.innerHTML = `<div data-resources='[{paths: ${JSON.stringify(paths)}}]'></div>`;
                const componentQueues: ComponentQueue[] = getComponentQueuesIn(container);

                expect(componentQueues[0][0].paths).toEqual(paths);
            });
        });
    });
})
