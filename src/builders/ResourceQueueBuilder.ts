import { ResourceQueue, ResourceDefinition } from '../types';

class ResourceQueueBuilder {
    DEFINITIONS: ResourceDefinition[] = [];
    ID: string = '';

    addDefinition = (definition: ResourceDefinition) => {
        this.DEFINITIONS.push(definition);
        return this;
    }

    build = (): ResourceQueue => {
        return {
            id: this.ID,
            definitions: this.DEFINITIONS
        }
    }
}


const createQueue = () => new ResourceQueueBuilder();

export const getDefaultQueue = createQueue().build;

export default createQueue;
