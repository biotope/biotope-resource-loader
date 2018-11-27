export type BaseMap = { [id: string]: string };

export interface Handler {
    match: (resource: Resource) => boolean;
    handle: (resource: Resource) => void;
}

export interface ComponentDefinition {
    paths: string[];
    dependsOn?: string[];
    base?: string;
    test?: () => boolean;
}

export interface ResourceLoaderOptions {
    container: string;
    readyEvent: string;
    base?: string;
    resources?: string[];
    baseMap?: BaseMap;
    handler?: Handler[]
}

export interface Resource {
    path: string;
    dependencyPaths: string[];
}
