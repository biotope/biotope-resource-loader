import toResources from './toResource';
import { ResourceLoaderOptions } from '../types';
import createHtmlComponentDefinition from '../builders/HTMLComponentDefinitionBuilder';

describe('#toResources', () => {
    const options: ResourceLoaderOptions = {
        readyEvent: ''
    }

    test('returns empty array for undefined', () => {
        const resources = toResources(options, undefined);

        expect(resources).toHaveLength(0);
    });

    test('returns empty array for empty paths', () => {
        const definition = createHtmlComponentDefinition().build();
        const resources = toResources(options, definition);

        expect(resources).toHaveLength(0);
    });

    test('returns resource for each path in the definition', () => {
        const definition = createHtmlComponentDefinition()
            .addPath('path1')
            .addPath('path2')
            .addPath('path3')
            .build();
        const resources = toResources(options, definition);

        expect(resources).toHaveLength(3);
    });

    test('sets the path of resource correctly', () => {
        const definition = createHtmlComponentDefinition()
            .addPath('path1')
            .build();
        const resources = toResources(options, definition);

        expect(resources[0].path).toBe('path1');
    });

    test('returns resource for each dependency', () => {
        const definition = createHtmlComponentDefinition()
            .addDependency('path1')
            .addDependency('path2')
            .addDependency('path3')
            .build();
        const resources = toResources(options, definition);

        expect(resources).toHaveLength(3);
    });

    test('sets path of dependency correctly', () => {
        const definition = createHtmlComponentDefinition()
            .addDependency('path1')
            .build();
        const resources = toResources(options, definition);

        expect(resources[0].path).toBe('path1');
    });

    test('sets dependency for path correctly', () => {
        const definition = createHtmlComponentDefinition()
            .addPath('path1')
            .addDependency('dependency1')
            .build();
        const resources = toResources(options, definition);

        expect(resources[0].dependencyPaths).toContain('dependency1');
    });

    test('sets element for path correctly', () => {
        const element = document.createElement('h1');
        const definition = createHtmlComponentDefinition()
            .addPath('path1')
            .withElement(element)
            .build();
        const resources = toResources(options, definition);

        expect(resources[0].elements).toContain(element);
    });
});

