import { ResourceDefinition, ResourceLoaderOptions } from '../types/external';
import resolveBaseWith from '../resolveBaseWith';
import createEnsureAbsolutePath from './toAbsolutePath';
import { isRelative } from './isRelative';
import ensureTrailingSlash from './ensureTrailingSlash';

const normalizePath = (path: string = '', resource: ResourceDefinition, options: ResourceLoaderOptions): string => {
    if (resource && options && isRelative(path)) {
        if (resource.base) {
            const resolveBase = resolveBaseWith(options.baseMap);
            const ensureAbsolutePath = createEnsureAbsolutePath(window.location)
            return ensureAbsolutePath(ensureTrailingSlash(resolveBase(resource.base)) + path);
        }
    }
    return path;
};

export default normalizePath;
