import { ComponentDefinition, ResourceLoaderOptions } from '../types';
import resolveBaseWith from '../resolveBaseWith';
import createEnsureAbsolutePath from './toAbsolutePath';
import isRelative from './isRelative';
import ensureTrailingSlash from './ensureTrailingSlash';
import isRootPath from './isRootPath';

const normalizePath = (path: string = '', resource: ComponentDefinition, options?: ResourceLoaderOptions): string => {
    if (resource && options && isRelative(path)) {
        if (resource.base) {
            const resolveBase = resolveBaseWith(options.baseMap);
            const ensureAbsolutePath = createEnsureAbsolutePath(window.location)
            return ensureAbsolutePath(ensureTrailingSlash(resolveBase(resource.base)) + path);
        } else if (options.base) {
            const ensureAbsolutePath = createEnsureAbsolutePath(window.location);
            if (isRootPath(path)) {
                return ensureAbsolutePath(path);
            }
            return ensureAbsolutePath(ensureTrailingSlash(options.base) + path);
        }
    }
    return path;
};

export default normalizePath;
