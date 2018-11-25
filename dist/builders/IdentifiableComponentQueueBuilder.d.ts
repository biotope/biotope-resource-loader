import { IdentifiableResourceDefinition } from '../types/internal';
import { IdentifiableComponentQueue } from '../types/internal';
declare class IdentifiableComponentQueueBuilder {
    DEFINITIONS: IdentifiableResourceDefinition[];
    ID: string;
    addDefinition: (definition: IdentifiableResourceDefinition) => this;
    build: () => IdentifiableComponentQueue;
}
declare const createIdentitfiableComponentQueue: () => IdentifiableComponentQueueBuilder;
export declare const getDefaultQueue: () => IdentifiableComponentQueue;
export default createIdentitfiableComponentQueue;
