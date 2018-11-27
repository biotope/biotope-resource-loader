import { ResourceLoaderOptions, HTMLComponentDefinition } from '../types';
import { Resource } from '../types';
import { curry } from 'ramda';
import normalizePath from '../pathManagement/normalizePath';
import { getDefaultHtmlComponentDefinition } from '../builders/HTMLComponentDefinitionBuilder';

const toResources = (options: ResourceLoaderOptions, definition: HTMLComponentDefinition = getDefaultHtmlComponentDefinition()): Resource[] => {
    const pathResources: Resource[] = definition.paths.map((path: string): Resource => ({
        path: normalizePath(path, definition, options),
        dependencyPaths: (definition.dependsOn ? definition.dependsOn : []).map(p => normalizePath(p, definition, options)),
        elements: [definition.element]
    }));

    const dependencyResources: Resource[] = (definition.dependsOn ? definition.dependsOn : []).map((path: string): Resource => ({
        path: normalizePath(path, definition, options),
        dependencyPaths: [],
        elements: [definition.element]
    }));

    return [
        ...pathResources,
        ...dependencyResources
    ]
}

export default curry(toResources);
