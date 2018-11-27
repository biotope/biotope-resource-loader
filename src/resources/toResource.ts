import { ComponentDefinition, ResourceLoaderOptions } from '../types';
import { Resource } from '../types';
import { getDefaultComponentDefinition } from '../builders/ComponentDefinitionBuilder';
import { curry } from 'ramda';
import normalizePath from '../pathManagement/normalizePath';

const toResources = (options: ResourceLoaderOptions, definition: ComponentDefinition = getDefaultComponentDefinition()): Resource[] => {
    const pathResources: Resource[] = definition.paths.map((path: string): Resource => ({
        path: normalizePath(path, definition, options),
        dependencyPaths: (definition.dependsOn ? definition.dependsOn : []).map(p => normalizePath(p, definition, options))
    }));

    const dependencyResources: Resource[] = (definition.dependsOn ? definition.dependsOn : []).map((path: string): Resource => ({
        path: normalizePath(path, definition, options),
        dependencyPaths: []
    }));

    return [
        ...pathResources,
        ...dependencyResources
    ]
}

export default curry(toResources);
