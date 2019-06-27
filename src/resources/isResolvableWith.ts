import { Resource } from '../types';
import getAllDependencies from './getAllDependencies';
import createResource from '../builders/ResourceBuilder';

const isResolvableWith = (resources: Resource[] = []) => (resource: Resource = createResource().build()) => {
	const dependencies: Resource[] = getAllDependencies(resources, resource);
	return resource.dependencyPaths.every(path => dependencies.some(dp => dp.path == path)) && !dependencies.some(dp => dp.path === resource.path) && dependencies.every(isResolvableWith(dependencies));
}

export default isResolvableWith;
