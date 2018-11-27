import toResources from './toResource';
import createComponentDefinition from '../builders/ComponentDefinitionBuilder';
import { ResourceLoaderOptions } from '../types';

describe('#toResources', () => {
    const options: ResourceLoaderOptions = {
        readyEvent: '',
        container: ''
    }

    test('returns empty array for undefined', () => {
        const resources = toResources(options, undefined);

        expect(resources).toHaveLength(0);
    });

    test('returns empty array for empty paths', () => {
        const definition = createComponentDefinition().build();
        const resources = toResources(options, definition);

        expect(resources).toHaveLength(0);
    });

    test('returns resource for each path in the definition', () => {
        const definition = createComponentDefinition()
            .addPath('path1')
            .addPath('path2')
            .addPath('path3')
            .build();
        const resources = toResources(options, definition);

        expect(resources).toHaveLength(3);
    });

    test('sets the path of resource correctly', () => {
        const definition = createComponentDefinition()
            .addPath('path1')
            .build();
        const resources = toResources(options, definition);

        expect(resources[0].path).toBe('path1');
    });

    test('returns resource for each dependency', () => {
        const definition = createComponentDefinition()
            .addDependency('path1')
            .addDependency('path2')
            .addDependency('path3')
            .build();
        const resources = toResources(options, definition);

        expect(resources).toHaveLength(3);
    });

    test('sets path of dependency correctly', () => {
        const definition = createComponentDefinition()
            .addDependency('path1')
            .build();
        const resources = toResources(options, definition);

        expect(resources[0].path).toBe('path1');
    });

    test('sets dependency for path correctly', () => {
        const definition = createComponentDefinition()
            .addPath('path1')
            .addDependency('dependency1')
            .build();
        const resources = toResources(options, definition);

        expect(resources[0].dependencyPaths).toContain('dependency1');
    });
});

