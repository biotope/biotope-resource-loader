
import produce from 'immer';
import { IdentifiableResourceDefinition, IdentifiableComponentQueue } from './types/internal';
import EVENTS from './constants/Events';

// flattens the datastructure to packages, add resource id to resolve back
function getDefinitionsFromQueues(queues: IdentifiableComponentQueue[]) {
  let flatten: IdentifiableResourceDefinition[] = [];
  for (const queue of queues) {
    for (const definition of queue.definitions) {
      const definitionClone: IdentifiableResourceDefinition = { ...definition };
      definitionClone.sourceId = queue.id;
      flatten = produce(flatten, draftState => {
        draftState.push(definition);
      });
    }
  }
  return flatten;
}

// if a package is ready the component is updated, if all packages are loaded a component ready event gets fired.
const updateComponentResources = (readyResources: IdentifiableComponentQueue[], resolvedDefinition: IdentifiableResourceDefinition) => {
  let ready: IdentifiableComponentQueue[] = [...readyResources];
  // loop over all component queues
  for (const readyComponentPkg in ready) {
    const { id, definitions } = ready[readyComponentPkg];

    // if the queue is the source of the definition
    if (id === resolvedDefinition.sourceId) {

      // loop over all definitions in the queue
      for (const pkgKey in definitions) {

        // if the definition is the same
        if (resolvedDefinition.id === definitions[pkgKey].id) {
          // remove the definition from this queue
          ready = produce(ready, draftState => {
            draftState[readyComponentPkg].definitions.splice(parseInt(pkgKey, 10), 1);
          });

          // fire ready event if all the definitions have been resolved
          const updatedResources = ready[readyComponentPkg].definitions;
          if (updatedResources.length === 0) {
            const event: CustomEvent<string> = new CustomEvent(EVENTS.COMPONENT_READY, { detail: id });
            document.dispatchEvent(event);
          }
        }
      }
    }
  }

  // return new queues without the resolved one
  return ready;
};

export { getDefinitionsFromQueues, updateComponentResources };
