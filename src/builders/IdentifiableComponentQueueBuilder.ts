import { IdentifiableResourceDefinition } from '../types/internal';
import { IdentifiableComponentQueue } from '../types/internal';

class IdentifiableComponentQueueBuilder {
    DEFINITIONS: IdentifiableResourceDefinition[] = [];
    ID: string = '';

    addDefinition = (definition: IdentifiableResourceDefinition) => {
        this.DEFINITIONS.push(definition);
        return this;
    }

    build = (): IdentifiableComponentQueue => {
        return {
            id: this.ID,
            definitions: this.DEFINITIONS
        }
    }
}


const createIdentitfiableComponentQueue = () => new IdentifiableComponentQueueBuilder();

export const getDefaultQueue = createIdentitfiableComponentQueue().build;

export default createIdentitfiableComponentQueue;
