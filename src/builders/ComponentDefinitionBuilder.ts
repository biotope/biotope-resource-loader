import { ComponentDefinition } from '../types';

class ComponentDefinitionBuilder {
    PATHS: string[] = [];
    BASE: string = '';
    DEPENDS_ON: string[] = [];
    TEST: () => boolean;


    addPath = (path: string) => {
        this.PATHS = this.PATHS || [];
        this.PATHS.push(path);
        return this;
    }

    addDependency = (path: string) => {
        this.DEPENDS_ON.push(path);
        return this;
    }

    withBase = (base: string) => {
        this.BASE = base;
        return this;
    }

    build = (): ComponentDefinition => {
        return {
            base: this.BASE,
            paths: this.PATHS,
            dependsOn: this.DEPENDS_ON,
            test: this.TEST
        }
    }
}


const createComponentDefinition = () => new ComponentDefinitionBuilder();

export const getDefaultComponentDefinition = createComponentDefinition().build;

export default createComponentDefinition;
