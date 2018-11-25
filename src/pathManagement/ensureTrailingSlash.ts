import { replace } from 'ramda';
import { getTrailingSlashesRegex } from '../Regex';

const ensureTrailingSlash = replace(getTrailingSlashesRegex(), '/');

export default ensureTrailingSlash;
