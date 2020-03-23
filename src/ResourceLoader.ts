import { ResourceLoaderOptions, Handler, HandleOptions } from './types';
import { Resource } from './types';
import { defaultOptions } from './defaultOptions';
import EVENTS from './Events';
import getResourcesFromContainer from './dom/getResourcesFromContainer';
import loadResources from './loadResources';
import getReadyResources from './resources/getReadyResources';
import isEmpty from './fp/isEmpty';
import difference from './fp/difference';
import remove from './fp/remove';
import cond from './fp/cond';
import isResolvableWith from './resources/isResolvableWith';
import registerScript from './registerScript';

class ResourceLoader {
	options: ResourceLoaderOptions = null;
	waitingResources: Resource[];
	pendingResources: Resource[] = [];
	loadedResources: Resource[] = [];

	get defaultContainer(): HTMLElement {
		return document.querySelector('body');
	}
	
	mutationObserver: MutationObserver;
	mutationObserverConfig: MutationObserverInit = {
		attributes: true,
		childList: true,
		subtree: true,
	};

	constructor(options: ResourceLoaderOptions) {
		this.options = {
			container: this.defaultContainer,
			...defaultOptions,
			...options
		};

		this.bindEvents();
		this.addMutationObserver();

		this.init(this.options);
	}

	private init(options: ResourceLoaderOptions) {
		this.prepareQueue(options);
		loadResources(this.pendingResources);
	}

	private addMutationObserver(): void {
		this.mutationObserver = new MutationObserver(this.handleMutation.bind(this));
		this.mutationObserver.observe(this.options.container, this.mutationObserverConfig);
	}

	private handleMutation(mutationRecordArray: MutationRecord[]): void {
    mutationRecordArray.forEach((({ addedNodes }: {addedNodes: NodeList}) => {
			addedNodes.forEach((node: Node) => {
				if (node instanceof HTMLElement && node.getAttribute(this.options.resourceListAtrributeSelector)) {
					this.init({...this.options, container: node.parentElement });
				}
			});
		}));
	}

	private prepareQueue(options: ResourceLoaderOptions) {

		this.waitingResources = [
			...getResourcesFromContainer(options, options.container)
		];

		this.waitingResources = this.cleanLoadedFromWaiting();

		this.waitingResources = this.waitingResources.filter(isResolvableWith(this.waitingResources));

		this.pendingResources = [
			...this.pendingResources,
			...getReadyResources(this.waitingResources, this.loadedResources)
		];

		this.waitingResources = difference(this.waitingResources, this.pendingResources);
	}

	private cleanLoadedFromWaiting() {
		return this.waitingResources.filter((resource: Resource) => !this.loadedResources.some((loaded: Resource) => loaded.path === resource.path));
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
		if (!this.options.initScripts) {
			return;
		}

		[].slice.call(document.querySelectorAll(`[${this.options.initScriptAttributeSelector}]`))
			.forEach((element: HTMLElement) =>
				this.getPluginFunction(element)(element, this.getPluginOptions(element))
			);
	}

	private getPluginFunction(element: HTMLElement): Function {
		return (
			window['biotope']['plugins'][element.getAttribute(this.options.initScriptAttributeSelector)]
		);
	}

	private getPluginOptions(element: HTMLElement): Object {
		return JSON.parse(element.getAttribute(this.options.scriptOptionsAttributeSelector));
	}

	public update() {
		this.init(this.options);
	}
}

export { ResourceLoader, registerScript };
export default ResourceLoader;
