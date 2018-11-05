import isAbsolute from "./helper/isAbsolute";
import isRootPath from "./helper/isRootPath";

const ensureTrailingSlash = (path: string) => path.replace(/\/?$/, '/');

const toAbsolutePath = (path: string = '') => {
    if (isAbsolute(path)) {
        return path;
    }
    if (isRootPath(path)) {
        return window.location.origin + path;
    }
    return ensureTrailingSlash(window.location.href) + path;
};

export default toAbsolutePath;
