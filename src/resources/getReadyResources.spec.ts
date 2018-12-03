import getReadyResources from './getReadyResources';
import createResource from '../builders/ResourceBuilder';

describe('#getReadyResrouces', () => {
    test('returns empty array for undefined', () => {
        const readyResources = getReadyResources();
        expect(readyResources).toHaveLength(0);
    });

    test('returns empty array for empty check array', () => {
        const readyResources = getReadyResources([], []);
        expect(readyResources).toHaveLength(0);
    });

    test('returns all resources without dependencies', () => {
        const pending = [
            createResource().build()
        ];
        const readyResources = getReadyResources(pending, []);
        expect(readyResources).toHaveLength(1);
    });

    test('returns all resources without dependencies', () => {
        const pending = [
            createResource().build(),
            createResource().build()
        ];
        const readyResources = getReadyResources(pending, []);
        expect(readyResources).toHaveLength(2);
    });

    test('does not return resources with dependencies not available in loaded', () => {
        const pending = [
            createResource().addDependency('dep1').build(),
            createResource().build()
        ];
        const readyResources = getReadyResources(pending, []);
        expect(readyResources).toHaveLength(1);
    });

    test('returns resources with dependencies available in loaded', () => {
        const pending = [
            createResource().addDependency('dep1').build(),
            createResource().addDependency('dep2').build()
        ];

        const loaded = [
            createResource().withPath('dep1').build()
        ];

        const readyResources = getReadyResources(pending, loaded);
        expect(readyResources).toHaveLength(1);
    });
});
