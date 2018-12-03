const isRootPath = (path: string) => path.indexOf('/') === 0 && path.indexOf('//') !== 0;

export default isRootPath;
