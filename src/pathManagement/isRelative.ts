import isAbsolute from './isAbsolute';
export const isRelative = (path: string) => !isAbsolute(path);
