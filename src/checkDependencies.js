const checkDependencies = resources => {
  const allPaths = [];
  const dependencies = [];
  // loop over resources object
  for (const resource of resources) {
    // take every resource object and loop over it's path's
    for (const paths of resource.resources) {
      // add path to allPaths
      for (const path of paths.paths) {
        allPaths.push(path);
      }
      // if has a dependency add it
      if (paths.dependsOn) {
        for (const dependency of paths.dependsOn) {
          dependencies.push(dependency);
        }
      }
    }
  }
  // check if dependencies are resolvable
  for (const dependency of dependencies) {
    if (allPaths.indexOf(dependency) === -1) {
      console.error(`⚠️ ERROR ${dependency} not resolvable.`);
    }
  }
};

const checkDependency = (dependents, requests) => {
  for (const d of dependents) {
    const result = requests.find(r => r.path === d);
    if (result === undefined) {
      // not all dependencies are lined up
      return false;
    }
  }
  // all dependencies are lined up
  return true;
};

export { checkDependency };

export default checkDependencies;
