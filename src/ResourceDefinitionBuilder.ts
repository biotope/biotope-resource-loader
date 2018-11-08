import { ResourceDefinition } from './types';

class ResourceDefinitionBuilder {
    ID: string = '';
    PATHS: string[] = [];
    SOURCE_ID: string = '';
    BASE: string;
    DEPENDS_ON: string[];
    TEST: () => boolean;


    withId = (id: string) => {
        this.ID = id;
        return this;
    }

    addPath = (path: string) => {
        this.PATHS = this.PATHS || [];
        this.PATHS.push(path);
        return this;
    }

    addDependency = (path: string) => {
        this.DEPENDS_ON = this.DEPENDS_ON || [];
        this.DEPENDS_ON.push(path);
        return this;
    }

    withBase = (base: string) => {
        this.BASE = base;
        return this;
    }

    build = (): ResourceDefinition => {
        return {
            base: this.BASE,
            id: this.ID,
            paths: this.PATHS,
            sourceId: this.SOURCE_ID,
            dependsOn: this.DEPENDS_ON,
            test: this.TEST
        }
    }
}


const createDefinition = () => new ResourceDefinitionBuilder();

export const getDefaultDefinition = createDefinition().build;

export default createDefinition;
