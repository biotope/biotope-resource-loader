import produce from 'immer';

function getComponentResources(resources) {
  let flatten = [];
  for (const resource of resources) {
    for (const componentResource of resource.resources) {
      const componentResourceClone = Object.assign({}, componentResource);
      componentResourceClone.sourceId = resource.id;
      flatten = produce(flatten, draftState => {
        draftState.push(componentResourceClone);
      });
    }
  }
  return flatten;
}

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

export { getComponentResources, updateComponentResources };
