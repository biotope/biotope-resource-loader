import { ResourceDefinition } from './external';
export declare type ComponentQueue = IdentifiableResourceDefinition[];
export interface IdentifiableComponentQueue {
    id: string;
    definitions: ComponentQueue;
}
export interface Resource {
    path: string;
    sourceIds: string[];
    componentIds: string[];
    fetchStatus: string;
    hasDependencies: boolean;
}
export interface IdentifiableResourceDefinition extends ResourceDefinition {
    id: string;
    sourceId: string;
}
export interface ComponentResource {
    sourceId: string;
}
