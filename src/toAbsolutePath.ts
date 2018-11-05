const isAbsolute = (path: string) => new RegExp('^(?:[a-z]+:)?//', 'i').test(path);
const isRootPath = (path: string) => path.indexOf('/') === 0 && path.indexOf('//') !== 0;
const ensureTrailingSlash = (path: string) => path.replace(/\/?$/, '/');


export const toAbsolutePath = (path: string = '') => {
    if (isAbsolute(path)) {
        return path;
    }
    if (isRootPath(path)) {
        return window.location.origin + path;
    }
    return ensureTrailingSlash(window.location.href) + path;
};
