import { IdentifiableResourceDefinition, IdentifiableComponentQueue } from './types/internal';
declare function getDefinitionsFromQueues(queues: IdentifiableComponentQueue[]): IdentifiableResourceDefinition[];
declare const updateComponentResources: (readyResources: IdentifiableComponentQueue[], resolvedDefinition: IdentifiableResourceDefinition) => IdentifiableComponentQueue[];
export { getDefinitionsFromQueues, updateComponentResources };
