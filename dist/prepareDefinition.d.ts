import { ResourceDefinition, ResourceLoaderOptions } from './types/external';
import { IdentifiableResourceDefinition } from './types/internal';
declare const prepareDefinition: (definition: ResourceDefinition, options: ResourceLoaderOptions) => IdentifiableResourceDefinition;
export default prepareDefinition;
