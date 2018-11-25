import { IdentifiableResourceDefinition } from '../types/internal';
declare class IdentifiableResourceDefinitionBuilder {
    ID: string;
    PATHS: string[];
    SOURCE_ID: string;
    BASE: string;
    DEPENDS_ON: string[];
    TEST: () => boolean;
    withId: (id: string) => this;
    addPath: (path: string) => this;
    addDependency: (path: string) => this;
    withBase: (base: string) => this;
    build: () => IdentifiableResourceDefinition;
}
declare const createIdentifiableResourceDefinition: () => IdentifiableResourceDefinitionBuilder;
export declare const getDefaultDefinition: () => IdentifiableResourceDefinition;
export default createIdentifiableResourceDefinition;
