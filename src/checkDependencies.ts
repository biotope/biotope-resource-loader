import hasDependencies from "./helper/hasDependencies";
import { IdentifiableComponentQueue } from './types/internal';

// checks if all packages are resolveable if not it will show an error.
const checkDependencies = (identitfiableResourceQueues: IdentifiableComponentQueue[]) => {
  const allPaths: string[] = [];
  const dependencies: string[] = [];

  for (const identitfiableResourceQueue of identitfiableResourceQueues) {
    for (const resourceDefinition of identitfiableResourceQueue.definitions) {
      allPaths.concat(resourceDefinition.paths);
      // if has a dependency add it
      if (hasDependencies(resourceDefinition)) {
        dependencies.concat(resourceDefinition.dependsOn);
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
