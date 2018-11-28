import curry from './curry';

const prop = (key: string, obj: object) => obj[key];

export default curry(prop);
