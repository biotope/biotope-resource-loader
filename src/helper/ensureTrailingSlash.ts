const ensureTrailingSlash = (text: string = '') => text.slice(-1) === '/' ? text : `${text}/`;

export default ensureTrailingSlash;
