import './polyfills/Object.assign';

import { ResourceLoaderOptions, Handler } from './types';
import { Resource } from './types';

import EVENTS from './Events';

import { isEmpty, remove, difference, cond } from 'ramda';

import getResourcesFromContainer from './dom/getResourcesFromContainer';
import loadResources from './loadResources';
import checkIfResolvable from './resources/checkIfResolvable';
import getReadyResources from './resources/getReadyResources';
import cssHandler from './handlers/cssHandler';
import jsHandler from './handlers/jsHandler';



class ResourceLoader {
    options: ResourceLoaderOptions = null;
    waitingResources: Resource[];
    pendingResources: Resource[] = [];
    loadedResources: Resource[] = [];
    defaultOptions: ResourceLoaderOptions = {
        container: 'body',
        readyEvent: 'resourcesReady',
        handler: [
            cssHandler,
            jsHandler
        ]
    }

    constructor(options: ResourceLoaderOptions) {
        this.options = {
            ...this.defaultOptions,
            ...options
        };

        this.init(this.options);
    }

    private init(options: ResourceLoaderOptions) {
        this.bindEvents();

        this.waitingResources = getResourcesFromContainer(options, document.querySelector(options.container));

        checkIfResolvable(this.waitingResources);

        this.pendingResources = getReadyResources(this.waitingResources, this.loadedResources);


        this.waitingResources = difference(this.waitingResources, this.pendingResources);

        loadResources(this.pendingResources);

    }

    public getStatus() {
        return {
            waiting: this.waitingResources,
            pending: this.pendingResources,
            loaded: this.loadedResources
        }
    }

    private bindEvents() {
        document.addEventListener(EVENTS.RESOURCE_LOADED, this.onResourceLoaded.bind(this));
        document.addEventListener(this.options.readyEvent, this.onReady.bind(this));
    }

    private onResourceLoaded(event: CustomEvent<{ resource: Resource, response: Response }>) {
        const resource = event.detail.resource;

        const handler: ReadonlyArray<[(resource: Resource) => boolean, (resource: Resource) => void]> = this.options.handler.map((handler: Handler): [(resource: Resource) => boolean, (resource: Resource) => void] => [handler.match, handler.handle]);

        cond(handler)(resource);

        this.loadedResources.push(resource);
        const readyForLoad = getReadyResources(this.waitingResources, this.loadedResources);

        this.pendingResources = [
            ...remove(this.pendingResources.indexOf(resource), 1, this.pendingResources),
            ...readyForLoad
        ]
        this.waitingResources = difference(this.waitingResources, this.pendingResources);

        loadResources(readyForLoad);

        if (isEmpty(this.waitingResources) && isEmpty(this.pendingResources)) {
            const event: CustomEvent = new CustomEvent(this.options.readyEvent);
            document.dispatchEvent(event);
        }
    }

    private onReady() {
        console.log('all resources loaded');
    }
}

window['ResourceLoader'] = ResourceLoader;
export default ResourceLoader;
