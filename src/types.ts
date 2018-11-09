export type BaseMap = { [id: string]: string };

export interface Dependency {
    path: string;
    fetch: string;
    hasDependencies: boolean;
}

export interface ResourceLoaderOptions {
    container: string;
    readyEvent: string;
    resources?: string[];
    baseMap?: BaseMap;
}

export interface ResourceDefinition {
    id: string;
    sourceId: string;
    paths: string[];
    dependsOn?: string[];
    base?: string;
    test?: () => boolean;
}

export interface ComponentResource {
    sourceId: string;
}

export interface ResourceQueue {
    id: string;
    definitions: ResourceDefinition[];
}
