import { Resource } from '../types';
import unnest from '../fp/unnest';
import unique from '../fp/unique';

const mergeResources = (resources: Resource[] = []) => {
    return resources.reduce((aggregated: Resource[], current: Resource) => {
        if (aggregated.map(r => r.path).indexOf(current.path) !== -1) {
            return aggregated;
        }
        return [
            ...aggregated,
            {
                ...current,
                dependencyPaths: unique(unnest(resources.filter(r => r.path === current.path).map(r => r.dependencyPaths || []))),
                elements: unique(unnest(resources.filter(r => r.path === current.path).map(r => r.elements || [])))
            }
        ]
    }, []);
}

export default mergeResources;
