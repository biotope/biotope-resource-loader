import produce from 'immer';
import { checkDependency } from './checkDependencies';

const uniquePath = (requests, path, hasDependencies, sourceId, id) => {
  let req = requests;
  const result = req.findIndex(req => req.path === path);
  if (result === -1) {
    req = produce(req, draftState => {
      draftState.push({
        path,
        hasDependencies,
        sourceIds: [sourceId],
        packageIds: [id],
        fetch: 'pending'
      });
    });
  } else {
    req = produce(req, draftState => {
      draftState[result].sourceIds.push(sourceId);
      draftState[result].packageIds.push(id);
    });
  }
  return req;
};

const addToQueue = (componentResources, requests = [], counter = 0) => {
  // recursive function to get load order
  let req = requests;
  const el = componentResources[0];
  let arr = componentResources;
  // counter counts up every unsuccessful reordering and resets itself on success. Therefor not resolvable packages get loaded last
  let i = counter;
  // if first element has depndecies and dependencies are not in load order yet and the total length of the array is greater/equal to 2 + counter
  if (
    el.dependsOn &&
		checkDependency(el.dependsOn, req) === false &&
		arr.length >= 2 + counter
  ) {
    i = i + 1; // counter get up
    const current = arr[0];
    const next = arr[i];
    arr = produce(arr, draftState => {
      draftState[0] = next;
      draftState[i] = current;
    });
  } else {
    // first item get's removed
    arr = produce(arr, draftState => {
      draftState.splice(0, 1);
    });
    // reset counter
    i = 0;
    let hasDependencies = false;
    if (el.dependsOn && el.dependsOn.length > 0) {
      hasDependencies = true;
    }
    // push all paths
    for (const p of el.paths) {
      req = uniquePath(req, p, hasDependencies, el.sourceId, el.id);
    }
  }
  // if array not empty go for it again 🏃‍
  if (arr.length !== 0) {
    return addToQueue(arr, req, i);
  } else {
    // return ordered requests.
    return req;
  }
};

export default addToQueue;
