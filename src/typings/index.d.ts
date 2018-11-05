type BaseMap = { [id: string]: string };

interface Dependency {
    path: string;
    fetch: string;
    hasDependencies: boolean;
}

interface ResourceLoaderOptions {
    container: string;
    readyEvent: string;
    resources: string[];
    baseMap: BaseMap;
}

interface ResourceDefinition {
    id: string;
    sourceId: string;
    paths: string[];
    dependsOn: string[];
    base: string;
    test: () => boolean;
}

interface ComponentResource {
    sourceId: string;
}

interface ResourceQueue {
    resources: ResourceDefinition[];
}
