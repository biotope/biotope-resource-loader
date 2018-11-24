import { ResourceDefinition } from './types';
import makeRandomId from './makeRandomId';
import normalizePath from './normalizePath';

const prepareDefinition = (definition: ResourceDefinition): ResourceDefinition => ({
    ...definition,
    id: makeRandomId(),
    paths: definition.paths.map(path => normalizePath(path, definition, options)),
    dependsOn: definition.dependsOn.map(path => normalizePath(path, definition, options))
});

export default prepareDefinition;
