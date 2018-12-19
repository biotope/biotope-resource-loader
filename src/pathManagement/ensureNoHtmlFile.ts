import isHtmlFilePath from './isHtmlFilePath';
import shift from '../fp/shift';

const ensureNoHtmlFile = (path: string) => isHtmlFilePath(path) ? shift(path.split('/').reverse()).reverse().join('/') : path;

export default ensureNoHtmlFile;
