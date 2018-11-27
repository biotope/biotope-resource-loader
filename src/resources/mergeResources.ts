import { Resource } from '../types';
import { unnest, uniq } from 'ramda';

const mergeResources = (resources: Resource[] = []) => {
    return resources.reduce((aggregated: Resource[], current: Resource) => {
        if (aggregated.map(r => r.path).indexOf(current.path) !== -1) {
            return aggregated;
        }
        return [
            ...aggregated,
            {
                ...current,
                dependencyPaths: uniq(unnest(resources.filter(r => r.path === current.path).map(r => r.dependencyPaths || [])))
            }
        ]
    }, []);
}

export default mergeResources;
