import { FETCH_STATUS } from './constants/FetchStatus';
import './polyfills/Object.assign';
import EVENTS from './constants/Events';

import produce from 'immer';

import loadResources from './loadResources';
import getQueuesFromDOM from './dom/getQueuesFromDom';
import checkDependencies from './checkDependencies';
import addToQueue from './addToQueue';
import {
  getDefinitionsFromQueues,
  updateComponentResources
} from './componentResources';
import { ResourceLoaderOptions } from './types/external';
import { IdentifiableComponentQueue, Resource, IdentifiableResourceDefinition } from './types/internal';
import hasDependencies from './helper/hasDependencies';
import prepareDefinition from './prepareDefinition';

class ResourceLoader {
  componentCounter: number = 0;
  options: ResourceLoaderOptions = null;
  queue: {
    componentQueues: IdentifiableComponentQueue[],
    resourceDefinitions: IdentifiableResourceDefinition[],
    readyResources: IdentifiableComponentQueue[],
    readyComponentResources: IdentifiableResourceDefinition[],
    resources: Resource[]
  } = {
      componentQueues: [],
      resourceDefinitions: [],
      readyResources: [],
      readyComponentResources: [],
      resources: []
    };

  constructor(options: ResourceLoaderOptions = { container: '', readyEvent: 'resourcesReady' }) {
    this.options = options;

    this.init(this.options);
  }

  bindEvents() {
    document.addEventListener(EVENTS.RESOURCE_LOADED, this.onResourceLoaded.bind(this));
    document.addEventListener(EVENTS.COMPONENT_READY, this.onComponentReady.bind(this));
    document.addEventListener(this.options.readyEvent, this.onReady.bind(this));
  }

  init(options: ResourceLoaderOptions) {
    this.queue.componentQueues = getQueuesFromDOM(document.querySelector(options.container))
      .map((queue: IdentifiableComponentQueue) => {
        return {
          ...queue,
          definitions: queue.definitions.map((definition: IdentifiableResourceDefinition) => {
            return prepareDefinition(definition, this.options)
          })
        }
      });


    // ⚠️ I DONT KNOW WHAT THIS DOES
    checkDependencies(this.queue.componentQueues);

    this.queue.resourceDefinitions = getDefinitionsFromQueues(this.queue.componentQueues);
    this.queue.resources = addToQueue(this.queue.resourceDefinitions);

    loadResources(this.queue.resources);

    this.queue.readyResources = [...this.queue.componentQueues];
    this.queue.readyComponentResources = [...this.queue.resourceDefinitions];

    this.bindEvents();
  }

  getStatus() {
    return this.queue;
  }

  update(container) {

  }

  onResourceLoaded(event: CustomEvent<Resource>) {
    for (const index in this.queue.resources) {
      if (event.detail.path === this.queue.resources[index].path) {
        this.queue.resources = {
          ...this.queue.resources,
          [index]: {
            ...this.queue.resources[index],
            fetch: FETCH_STATUS.DONE
          }
        }
        break;
      }
    }

    // loop through all definitions
    for (const definitionIndex in this.queue.readyComponentResources) {
      const definition = this.queue.readyComponentResources[definitionIndex];
      if (hasDependencies(definition)) {
        // check if resolved resource is a dependency
        const index = definition.dependsOn.indexOf(event.detail.path);
        if (index > -1) {
          // and remove dependency from dependency queue
          this.queue.readyComponentResources = produce(
            this.queue.readyComponentResources,
            draftState => {
              draftState[definitionIndex].dependsOn.splice(index, 1);
            }
          );

          // if there are no more dependencies now, add the definition
          const updatedDefinition = this.queue.readyComponentResources[definitionIndex];
          if (!hasDependencies(updatedDefinition)) {
            loadResources(addToQueue([updatedDefinition]), true);
          }
        }
      }
      // if there are no dependencies set
      else {
        // check if the loaded resource is a main resource of this definition
        const index = definition.paths.indexOf(event.detail.path);
        if (index > -1) {
          this.queue.readyComponentResources = produce(
            this.queue.readyComponentResources,
            draftState => {
              draftState[definitionIndex].paths.splice(index, 1);
            }
          );
          // if all the resources have been resolved
          const updatedPkg = this.queue.readyComponentResources[definitionIndex];
          if (updatedPkg.paths.length === 0) {
            this.queue.readyResources = updateComponentResources(
              this.queue.readyResources,
              definition
            );
          }
        }
      }
    }
  }

  onComponentReady(event: CustomEvent<string>) {
    console.log(`component with id: ${event.detail} ready`);
    this.componentCounter++;
    if (this.allComponentsResolved) {
      const event: CustomEvent = new CustomEvent(this.options.readyEvent);
      document.dispatchEvent(event);
    }
  }

  onReady(event: CustomEvent) {
    console.log('all resources loaded');
  }

  private get allComponentsResolved() {
    return this.componentCounter === this.queue.readyResources.length;
  }
}
// const update = container => {
//   // ☕ Merging all
//   queue.definitions = getQueuesFromDOM(container, options, queue);
//   // 🤞 check again
//   checkDependencies(queue.definitions);
//   // update component resources
//   queue.componentResources = getDefinitionsFromQueues(queue.definitions);
//   console.log(queue.requests);
//   queue.requests = addToQueue(queue.componentResources, queue.requests);
//   console.log(queue.requests);
//   // ⚠️ thats not gonna work ✌️ we need to first uncheck all already loaded stuff
//   // 🎆 fire events

//   getPackages(queue.requests);
//   // getPackages(newRequests);
// };

export default ResourceLoader;
