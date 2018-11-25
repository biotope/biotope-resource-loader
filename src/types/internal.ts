import { ResourceDefinition } from './external';

export type ComponentQueue = IdentifiableResourceDefinition[];

export interface IdentifiableComponentQueue {
    id: string;
    definitions: ComponentQueue;
}

export interface Dependency {
    path: string;
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
