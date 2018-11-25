import { Resource } from '../types/internal';
declare class ResourceBuilder {
    SOURCE_IDS: string[];
    COMPONENT_IDS: string[];
    PATH: string;
    HAS_DEPENDENCIES: boolean;
    FETCH_STATUS: string;
    addSourceId: (id: string) => this;
    addComponentId: (id: string) => this;
    withFetchStatus: (status: string) => this;
    withDependencies: () => this;
    build: () => Resource;
}
declare const createResource: () => ResourceBuilder;
export declare const getDefaultResource: () => Resource;
export default createResource;
