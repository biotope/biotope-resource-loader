import { replace } from 'ramda';
import { getLeadingSlashesRegex } from '../Regex';

const ensureNoLeadingSlash = replace(getLeadingSlashesRegex(), '');

export default ensureNoLeadingSlash;
