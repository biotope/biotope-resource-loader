import './polyfills/Object.assign';

import { ResourceLoaderOptions } from './types';
import { Resource } from './types';

import EVENTS from './Events';

import getResourcesFromContainer from './dom/getResourcesFromContainer';
import loadResources from './loadResources';
import { isEmpty, remove, difference, cond } from 'ramda';
import checkIfResolvable from './resources/checkIfResolvable';
import getReadyResources from './resources/getReadyResources';
import onJsLoaded, { isJs } from './handlers/onJsLoaded';
import onCssLoaded, { isCss } from './handlers/onCssLoaded';



class ResourceLoader {
    componentCounter: number = 0;
    options: ResourceLoaderOptions = null;
    waitingResources: Resource[];
    pendingResources: Resource[] = [];
    loadedResources: Resource[] = [];

    constructor(options: ResourceLoaderOptions = { container: '', readyEvent: 'resourcesReady' }) {
        this.options = options;

        this.init(this.options);
    }

    private init(options: ResourceLoaderOptions) {
        this.bindEvents();

        this.waitingResources = getResourcesFromContainer(options, document.querySelector(options.container));
        this.logStatus();
        checkIfResolvable(this.waitingResources);

        this.pendingResources = getReadyResources(this.waitingResources, this.loadedResources);


        this.waitingResources = difference(this.waitingResources, this.pendingResources);

        this.logStatus();
        loadResources(this.pendingResources);

    }

    private logStatus() {
        console.log('Waiting ', [...this.waitingResources]);
        console.log('Pending ', [...this.pendingResources]);
        console.log('Loaded ', [...this.loadedResources]);
    }

    private bindEvents() {
        document.addEventListener(EVENTS.RESOURCE_LOADED, this.onResourceLoaded.bind(this));
        document.addEventListener(this.options.readyEvent, this.onReady.bind(this));
    }

    private onResourceLoaded(event: CustomEvent<Resource>) {
        const resource = event.detail;

        cond([
            [isJs, onJsLoaded],
            [isCss, onCssLoaded]
        ])(resource);

        this.loadedResources.push(resource);
        const readyForLoad = getReadyResources(this.waitingResources, this.loadedResources);

        this.pendingResources = [
            ...remove(this.pendingResources.indexOf(resource), 1, this.pendingResources),
            ...readyForLoad
        ]
        this.waitingResources = difference(this.waitingResources, this.pendingResources);


        this.logStatus();
        console.log('Loading', readyForLoad);
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
