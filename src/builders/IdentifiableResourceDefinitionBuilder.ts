import { IdentifiableResourceDefinition } from '../types/internal';

class IdentifiableResourceDefinitionBuilder {
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

    build = (): IdentifiableResourceDefinition => {
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


const createIdentifiableResourceDefinition = () => new IdentifiableResourceDefinitionBuilder();

export const getDefaultDefinition = createIdentifiableResourceDefinition().build;

export default createIdentifiableResourceDefinition;
