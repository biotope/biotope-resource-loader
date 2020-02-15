import cssHandler from './handlers/cssHandler';
import jsHandler from './handlers/jsHandler';
import { ResourceLoaderOptions } from './types';
import htmlHandler from './handlers/htmlHandler';

export const defaultOptions: ResourceLoaderOptions = {
    resourceListAtrributeSelector: 'data-resources',
    initScriptAttributeSelector: 'data-init',
    scriptOptionsAttributeSelector: 'data-options',
    initScripts: true,
    readyEvent: 'resourcesReady',
    handler: [
        cssHandler,
        jsHandler,
        htmlHandler,
    ]
};
