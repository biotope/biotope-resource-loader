import cssHandler from './handlers/cssHandler';
import jsHandler from './handlers/jsHandler';
import htmlHandler from './handlers/htmlHandler';
import { ResourceLoaderOptions } from './types';

export const defaultOptions: ResourceLoaderOptions = {
    resourceListAtrributeSelector: 'data-resources',
    initScriptAttributeSelector: 'data-init',
    scriptOptionsAttributeSelector: 'data-options',
    initScripts: true,
    readyEvent: 'resourcesReady',
    scriptParsedEvent: 'scriptParsed',
    handler: [
        cssHandler,
        jsHandler,
        htmlHandler,
    ]
};
