import { FETCH_STATUS } from './constants/FetchStatus';
import './polyfills/Object.assign';
import EVENTS from './constants/Events';

import produce from 'immer';

import getPackages from './getPackages';
import getQueuesFromDOM from './dom/getQueuesFromDom';
import checkDependencies from './checkDependencies';
import addToQueue from './addToQueue';
import {
  getDefinitionsFromQueues,
  updateComponentResources
} from './componentResources';
import { ResourceLoaderOptions } from './types/external';
import { IdentifiableComponentQueue, Dependency, IdentifiableResourceDefinition } from './types/internal';
import hasDependencies from './helper/hasDependencies';

class ResourceLoader {
  options: ResourceLoaderOptions = null;
  queue: {
    definitions: IdentifiableComponentQueue[],
    componentResources: IdentifiableResourceDefinition[],
    readyResources: IdentifiableComponentQueue[],
    readyComponentResources: IdentifiableResourceDefinition[],
    requests: any[]
  } = {
      definitions: [],
      componentResources: [],
      readyResources: [],
      readyComponentResources: [],
      requests: []
    };

  constructor(options: ResourceLoaderOptions = { container: '', readyEvent: 'resourcesReady' }) {
    this.options = options;

    this.init(this.options);
  }

  init(options: ResourceLoaderOptions) {
    // Then create identifiable component queues from container
    this.queue.definitions = getQueuesFromDOM(document.querySelector(options.container));

    // I DONT KNOW WHAT THIS DOES
    checkDependencies(this.queue.definitions);

    // Flatten all the queues
    this.queue.componentResources = getDefinitionsFromQueues(this.queue.definitions);

    // Add all the definitions to the main queue
    this.queue.requests = addToQueue(this.queue.componentResources);

    // Actually load the resources
    getPackages(this.queue.requests);

    // Clone component queues
    this.queue.readyResources = [...this.queue.definitions];

    // Clone definitions
    this.queue.readyComponentResources = [...this.queue.componentResources];

    // On one resource loaded
    document.addEventListener(EVENTS.RESOURCE_LOADED, (event: CustomEvent<Dependency>) => {
      // Check all requests and set the fetch status to done
      for (const index in this.queue.requests) {
        if (event.detail.path === this.queue.requests[index].path) {
          this.queue.requests = {
            ...this.queue.requests,
            [index]: {
              ...this.queue.requests[index],
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
              getPackages(addToQueue([updatedDefinition]), true);
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
    });



    let componentCounter = 0;
    document.addEventListener(EVENTS.COMPONENT_READY, (e: CustomEvent<string>) => {
      console.log(`component with id: ${e.detail} ready`);
      componentCounter++;
      // if all components have been resolved
      if (componentCounter === this.queue.readyResources.length) {
        const event: CustomEvent = new CustomEvent(options.readyEvent);
        document.dispatchEvent(event);
      }
    });

    document.addEventListener(options.readyEvent, (e: CustomEvent) => {
      console.log('all resources loaded');
    });
  }

  getStatus() {
    return this.queue;
  }

  update(container) {

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
