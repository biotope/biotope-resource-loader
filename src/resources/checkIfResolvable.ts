import { Resource } from '../types';
import getResourceByPath from './getResourceByPath';

// checks if all packages are resolveable if not it will show an error.
const checkIfResolvable = (resources: Resource[] = []): boolean => {
  return resources.every(resource => resource.dependencyPaths.every(path => !!getResourceByPath(resources, path)));
};

export default checkIfResolvable;
