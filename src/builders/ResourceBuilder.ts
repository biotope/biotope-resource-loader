import { Resource } from '../types';

class ResourceBuilder {
    PATH: string = '';
    DEPENDENCIES: string[] = [];

    addDependency = (path: string) => {
        this.DEPENDENCIES.push(path);
        return this;
    }

    withPath = (path: string) => {
        this.PATH = path;
        return this;
    }

    build = (): Resource => {
        return {
            path: this.PATH,
            dependencyPaths: this.DEPENDENCIES
        }
    }
}


const createResource = () => new ResourceBuilder();

export const getDefaultResource = createResource().build;

export default createResource;
