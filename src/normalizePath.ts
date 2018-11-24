import { ResourceDefinition, ResourceLoaderOptions } from './types';
import resolveBaseWith from './resolveBaseWith';
import toAbsolutePath from './toAbsolutePath';
import { isRelative } from './helper/isRelative';
import ensureTrailingSlash from './helper/ensureTrailingSlash';

const normalizePath = (path: string = '', resource: ResourceDefinition, options: ResourceLoaderOptions): string => {
    if (resource && options && isRelative(path)) {
        if (resource.base) {
            const resolveBase = resolveBaseWith(options.baseMap);
            return toAbsolutePath(ensureTrailingSlash(resolveBase(resource.base)) + path);
        }
    }
    return path;
};

export default normalizePath;

// function getPath(path, resource, options) {
//     const pathIsRelative =
//         path.indexOf('http://') === -1 &&
//         path.indexOf('https://') === -1 &&
//         path.charAt(0) !== '/';
//     // resolve relative paths
//     if (pathIsRelative) {
//         if (resource.base) {
//             const resolveBase = resolveBaseWith(options.baseMap);

//             return toAbsolutePath(resolveBase(resource.base) + path);
//         } else if (options && options.base) {
//             return toAbsolutePath(options.base + path);
//         }
//     }
//     return toAbsolutePath(path);
// }
