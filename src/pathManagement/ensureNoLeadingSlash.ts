import { getLeadingSlashesRegex } from '../Regex';
import replace from '../fp/replace';

const ensureNoLeadingSlash = replace(getLeadingSlashesRegex(), '');

export default ensureNoLeadingSlash;
