import { HTMLComponentDefinition } from '../types';

class HTMLComponentDefinitionBuilder {
    private PATHS: string[] = [];
    private BASE: string = '';
    private DEPENDS_ON: string[] = [];
    private TEST: () => boolean;
    private ELEMENT: HTMLElement;

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

    withElement = (element: HTMLElement) => {
        this.ELEMENT = element;
        return this;
    }

    build = (): HTMLComponentDefinition => {
        return {
            base: this.BASE,
            paths: this.PATHS,
            dependsOn: this.DEPENDS_ON,
            test: this.TEST,
            element: this.ELEMENT
        }
    }
}

const createHtmlComponentDefinition = () => new HTMLComponentDefinitionBuilder();

export const getDefaultHtmlComponentDefinition = createHtmlComponentDefinition().build;
export default createHtmlComponentDefinition;
