import { ResourceLoaderOptions, HTMLComponentDefinition } from '../types';
import getContentDefinitionsFromDOM from './getContentDefinitionsFromDOM';
import { Resource } from '../types';
import mergeResources from '../resources/mergeResources';
import toResources from '../resources/toResource';
import unnest from '../fp/unnest';
import curry from '../fp/curry';

const getResourcesFromContainer = (options: ResourceLoaderOptions, container: HTMLElement): Resource[] => {
    const componentDefinitions: HTMLComponentDefinition[] = getContentDefinitionsFromDOM(container, options.resourceListAtrributeSelector);

    return mergeResources(unnest(componentDefinitions.map(toResources(options))));
}

export default curry(getResourcesFromContainer);
