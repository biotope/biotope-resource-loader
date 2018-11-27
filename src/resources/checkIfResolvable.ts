import { Resource } from '../types';
import getResourceByPath from './getResourceByPath';

// ⚠️ TODO: does not check circular dependencies!!!
const checkIfResolvable = (resources: Resource[] = []): boolean => {
  return resources.every(resource => resource.dependencyPaths.every(path => !!getResourceByPath(resources, path)));
};

export default checkIfResolvable;
