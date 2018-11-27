import isAbsolute from './isAbsolute';
const isRelative = (path: string) => !isAbsolute(path);

export default isRelative;
