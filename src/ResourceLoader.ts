import { ResourceLoaderOptions, Handler, HandleOptions } from './types';
import { Resource } from './types';
import EVENTS from './Events';
import getResourcesFromContainer from './dom/getResourcesFromContainer';
import loadResources from './loadResources';
import checkIfResolvable from './resources/checkIfResolvable';
import getReadyResources from './resources/getReadyResources';
import cssHandler from './handlers/cssHandler';
import jsHandler from './handlers/jsHandler';
import isEmpty from './fp/isEmpty';
import difference from './fp/difference';
import remove from './fp/remove';
import cond from './fp/cond';

export class ResourceLoader {
    options: ResourceLoaderOptions = null;
    waitingResources: Resource[];
    pendingResources: Resource[] = [];
    loadedResources: Resource[] = [];
    defaultOptions: ResourceLoaderOptions = {
        readyEvent: 'resourcesReady',
        handler: [
            cssHandler,
            jsHandler
        ]
    }

    get defaultContainer(): HTMLElement {
        return document.querySelector('body');
    }

    constructor(options: ResourceLoaderOptions) {
        this.options = {
            container: this.defaultContainer,
            ...this.defaultOptions,
            ...options
        };

        this.bindEvents();

        this.init(this.options);
    }

    private init(options: ResourceLoaderOptions) {
        this.waitingResources = [
            ...getResourcesFromContainer(options, options.container)
        ];

        checkIfResolvable(this.waitingResources);

        this.pendingResources = [
            ...this.pendingResources,
            ...getReadyResources(this.waitingResources, this.loadedResources)
        ];


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

        const handler: ReadonlyArray<[(options: HandleOptions) => boolean, (options: HandleOptions) => void]> = this.options.handler.map((handler: Handler): [(options: HandleOptions) => boolean, (options: HandleOptions) => void] => [handler.match, handler.handle]);

        cond(handler)(event.detail);

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

    }

    public update(container: HTMLElement) {
        this.init({
            ...this.options,
            container
        });
    }
}

export default ResourceLoader;
