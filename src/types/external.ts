export type BaseMap = { [id: string]: string };

export interface ResourceDefinition {
    paths: string[];
    dependsOn?: string[];
    base?: string;
    test?: () => boolean;
}

export interface ResourceLoaderOptions {
    container: string;
    readyEvent: string;
    resources?: string[];
    baseMap?: BaseMap;
}



