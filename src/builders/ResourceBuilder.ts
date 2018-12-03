import { Resource } from '../types';

class ResourceBuilder {
    private PATH: string = '';
    private DEPENDENCIES: string[] = [];
    private ELEMENTS: HTMLElement[] = [];

    addDependency = (path: string) => {
        this.DEPENDENCIES.push(path);
        return this;
    }

    withPath = (path: string) => {
        this.PATH = path;
        return this;
    }

    addElement = (element: HTMLElement) => {
        this.ELEMENTS.push(element);
        return this;
    }

    build = (): Resource => {
        return {
            path: this.PATH,
            dependencyPaths: this.DEPENDENCIES,
            elements: this.ELEMENTS
        }
    }
}


const createResource = () => new ResourceBuilder();

export const getDefaultResource = createResource().build;

export default createResource;
