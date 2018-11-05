export const isAbsolute = (path: string) => new RegExp('^(?:[a-z]+:)?//', 'i').test(path);
