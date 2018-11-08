import hasDependencies from "./helper/hasDependencies";
import { ResourceQueue } from "./types";

// checks if all packages are resolveable if not it will show an error.
const checkDependencies = (resources: ResourceQueue[]) => {
  const allPaths = [];
  const dependencies = [];
  // loop over resources object
  for (const resourceQueue of resources) {
    // take every resource object and loop over it's path's
    for (const definition of resourceQueue.definitions) {
      // add path to allPaths
      for (const path of definition.paths) {
        allPaths.push(path);
      }
      // if has a dependency add it
      if (hasDependencies(definition)) {
        for (const dependency of definition.dependsOn) {
          dependencies.push(dependency);
        }
      }
    }
  }
  // check if dependencies are resolvable
  for (const dependency of dependencies) {
    if (allPaths.indexOf(dependency) === -1) {
      console.error(
        `⚠️ ERROR ${dependency} not resolvable. Not all events will be fired!`
      );
    }
  }
};

export default checkDependencies;
