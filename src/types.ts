export type BaseMap = { [id: string]: string };

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
}

export interface Resource {
    path: string;
    dependencyPaths: string[];
}
