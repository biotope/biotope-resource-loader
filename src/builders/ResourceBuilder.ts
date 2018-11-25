import { FETCH_STATUS } from './../constants/FetchStatus';
import { IdentifiableResourceDefinition, Resource } from '../types/internal';
import { IdentifiableComponentQueue } from '../types/internal';

class ResourceBuilder {
    SOURCE_IDS: string[] = [];
    COMPONENT_IDS: string[] = [];
    PATH: string = '';
    HAS_DEPENDENCIES = false;
    FETCH_STATUS: string = FETCH_STATUS.PENDING;

    addSourceId = (id: string) => {
        this.SOURCE_IDS.push(id);
        return this;
    }

    addComponentId = (id: string) => {
        this.COMPONENT_IDS.push(id);
        return this;
    }

    withFetchStatus = (status: string) => {
        this.FETCH_STATUS = status;
        return this;
    }

    withDependencies = () => {
        this.HAS_DEPENDENCIES = true;
        return this;
    }

    build = (): Resource => {
        return {
            path: this.PATH,
            sourceIds: this.SOURCE_IDS,
            componentIds: this.COMPONENT_IDS,
            fetchStatus: this.FETCH_STATUS,
            hasDependencies: this.HAS_DEPENDENCIES
        }
    }
}


const createResource = () => new ResourceBuilder();

export const getDefaultResource = createResource().build;

export default createResource;
