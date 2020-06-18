import cssHandler from './handlers/cssHandler';
import jsHandler from './handlers/jsHandler';
import htmlHandler from './handlers/htmlHandler';
import { ResourceLoaderOptions } from './types';

export const defaultOptions: ResourceLoaderOptions = {
    resourceListAttributeSelector: 'data-resources',
    initScriptAttributeSelector: 'data-init',
    scriptOptionsAttributeSelector: 'data-options',
    initScripts: true,
    resourceQueueEmptyEventName: 'resourceQueueEmpty',
    styleReadyEventName: 'styleReady',
    scriptReadyEventName: 'scriptReady',
    htmlReadyEventName: 'htmlReady',
    handler: [
        cssHandler,
        jsHandler,
        htmlHandler,
    ]
};
