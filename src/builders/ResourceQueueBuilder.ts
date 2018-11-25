import { IdentifiableComponentQueue } from '../types/internal';
import { ResourceDefinition } from '../types/external';

class IdentifiableComponentQueueBuilder {
    DEFINITIONS: ResourceDefinition[] = [];
    ID: string = '';

    addDefinition = (definition: ResourceDefinition) => {
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
