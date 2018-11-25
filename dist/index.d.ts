import './polyfills/Object.assign';
import { ResourceLoaderOptions } from './types/external';
import { IdentifiableComponentQueue, Resource, IdentifiableResourceDefinition } from './types/internal';
declare class ResourceLoader {
    componentCounter: number;
    options: ResourceLoaderOptions;
    queue: {
        componentQueues: IdentifiableComponentQueue[];
        resourceDefinitions: IdentifiableResourceDefinition[];
        readyResources: IdentifiableComponentQueue[];
        readyComponentResources: IdentifiableResourceDefinition[];
        resources: Resource[];
    };
    constructor(options?: ResourceLoaderOptions);
    bindEvents(): void;
    init(options: ResourceLoaderOptions): void;
    getStatus(): {
        componentQueues: IdentifiableComponentQueue[];
        resourceDefinitions: IdentifiableResourceDefinition[];
        readyResources: IdentifiableComponentQueue[];
        readyComponentResources: IdentifiableResourceDefinition[];
        resources: Resource[];
    };
    update(container: any): void;
    onResourceLoaded(event: CustomEvent<Resource>): void;
    onComponentReady(event: CustomEvent<string>): void;
    onReady(event: CustomEvent): void;
    private readonly allComponentsResolved;
}
export default ResourceLoader;
