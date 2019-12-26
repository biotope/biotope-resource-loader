export type BaseMap = { [id: string]: string };

export interface HandleOptions {
    resource: Resource;
    response: Response;
}

export interface Handler {
    match: (options: HandleOptions) => boolean;
    handle: (options: HandleOptions) => void;
}

export interface ComponentDefinition {
    paths: string[];
    dependsOn?: string[];
    base?: string;
    test?: () => boolean;
}

export interface HTMLComponentDefinition extends ComponentDefinition {
    element: HTMLElement;
}

export interface ResourceLoaderOptions {
    container?: HTMLElement;
    resourceListAtrributeSelector?: string;
    readyEvent?: string;
    base?: string;
    resources?: string[];
    baseMap?: BaseMap;
    handler?: Handler[]
}

export interface Resource {
    path: string;
    dependencyPaths: string[];
    elements: HTMLElement[];
}
