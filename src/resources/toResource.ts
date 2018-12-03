import { ResourceLoaderOptions, HTMLComponentDefinition } from '../types';
import { Resource } from '../types';
import normalizePath from '../pathManagement/normalizePath';
import curry from '../fp/curry';

const toResources = (options: ResourceLoaderOptions, definition: HTMLComponentDefinition): Resource[] => {
    if (!definition) {
        return [];
    }
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
