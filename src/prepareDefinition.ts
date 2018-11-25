import { ResourceDefinition, ResourceLoaderOptions } from './types/external';
import makeRandomId from './makeRandomId';
import normalizePath from './pathManagement/normalizePath';
import { IdentifiableResourceDefinition } from './types/internal';

const prepareDefinition = (definition: ResourceDefinition, options: ResourceLoaderOptions): IdentifiableResourceDefinition => ({
    ...definition,
    id: makeRandomId(),
    paths: definition.paths.map(path => normalizePath(path, definition, options)),
    dependsOn: definition.dependsOn.map(path => normalizePath(path, definition, options)),
    sourceId: ''
});

export default prepareDefinition;
