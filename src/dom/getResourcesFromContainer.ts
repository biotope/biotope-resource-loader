import { ComponentDefinition, ResourceLoaderOptions } from '../types';
import getContentDefinitionsFromDOM from './getContentDefinitionsFromDOM';
import { Resource } from '../types';
import mergeResources from '../resources/mergeResources';
import { unnest, curry } from 'ramda';
import toResources from '../resources/toResource';

const getResourcesFromContainer = (options: ResourceLoaderOptions, container: HTMLElement): Resource[] => {
    const componentDefinitions: ComponentDefinition[] = getContentDefinitionsFromDOM(container);

    return mergeResources(unnest(componentDefinitions.map(toResources(options))));
}

export default curry(getResourcesFromContainer);
