import { IdentifiableResourceDefinition, Resource } from './types/internal';
declare const addToQueue: (resourceDefinitions?: IdentifiableResourceDefinition[], queuedResources?: Resource[], counter?: number) => Resource[];
export default addToQueue;
