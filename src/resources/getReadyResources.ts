import { Resource } from '../types';

const getReadyResources = (resourcesToCheck: Resource[] = [], loadedResources: Resource[] = []) => {
    return resourcesToCheck.filter(resource => resource.dependencyPaths.every(path => loadedResources.some(res => res.path === path)));
}

export default getReadyResources;
