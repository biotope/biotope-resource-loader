import cssHandler from './handlers/cssHandler';
import jsHandler from './handlers/jsHandler';
import { ResourceLoaderOptions } from './types';

export const defaultOptions: ResourceLoaderOptions = {
    resourceListAtrributeSelector: 'data-resources',
    initScriptAttributeSelector: 'data-init',
    pluginOptionsAttributeSelector: 'data-options',
    initScripts: true,
    readyEvent: 'resourcesReady',
    handler: [
        cssHandler,
        jsHandler
    ]
};
