import produce from 'immer';
import { ComponentResource, ResourceQueue, ResourceDefinition } from './types';

// flattens the datastructure to packages, add resource id to resolve back
function getDefinitionsFromQueues(queues: ResourceQueue[]) {
  let flatten: ResourceDefinition[] = [];
  for (const queue of queues) {
    for (const definition of queue.definitions) {
      const definitionClone: ResourceDefinition = { ...definition };
      definitionClone.sourceId = queue.id;
      flatten = produce(flatten, draftState => {
        draftState.push(definition);
      });
    }
  }
  return flatten;
}

// if a package is ready the component is updated, if all packages are loaded a component ready event gets fired.
const updateComponentResources = (readyResources, pkg) => {
  let ready = produce(readyResources, draftState => draftState);
  for (const readyComponentPkg in ready) {
    const { id, resources } = ready[readyComponentPkg];
    if (id === pkg.sourceId) {
      for (const pkgKey in resources) {
        if (pkg.id === resources[pkgKey].id) {
          ready = produce(ready, draftState => {
            draftState[readyComponentPkg].resources.splice(pkgKey, 1);
          });
          const updatedResources = ready[readyComponentPkg].resources;
          if (updatedResources.length === 0) {
            const e = new CustomEvent('componentReady', { detail: id });
            document.dispatchEvent(e);
          }
        }
      }
    }
  }
  return ready;
};

export { getDefinitionsFromQueues, updateComponentResources };
