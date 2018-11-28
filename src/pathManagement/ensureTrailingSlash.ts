import { getTrailingSlashesRegex } from '../Regex';
import replace from '../fp/replace';

const ensureTrailingSlash = replace(getTrailingSlashesRegex(), '/');

export default ensureTrailingSlash;
