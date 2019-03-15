import { Resource } from '../types';

const getAllDependencies = (source: Resource[] = [], target: Resource) => {
	const directDependencies = source
		.filter(currentResource => target.dependencyPaths.indexOf(currentResource.path) != -1);
	const remaining = source.filter(check => directDependencies.indexOf(check) === -1)
	return directDependencies.reduce((aggr, cur) => [...aggr, ...getAllDependencies(remaining, cur)], directDependencies);
}

export default getAllDependencies;
