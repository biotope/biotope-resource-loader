interface Dependency {
    path: string;
    fetch: string;
    hasDependencies: boolean;
}

interface ResourceLoaderOptions {
    container: string;
    readyEvent: string;
    reseources
}

interface ResourceDefinition {
    id: string;
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
