import cssHandler from './handlers/cssHandler';
import jsHandler from './handlers/jsHandler';
import { ResourceLoaderOptions } from './types';
import htmlHandler from './handlers/htmlHandler';

export const defaultOptions: ResourceLoaderOptions = {
    resourceListAtrributeSelector: 'data-resources',
    initPluginAttributeSelector: 'data-init',
    pluginOptionsAttributeSelector: 'data-options',
    initPlugins: true,
    readyEvent: 'resourcesReady',
    handler: [
        cssHandler,
        jsHandler,
        htmlHandler,
    ]
};
