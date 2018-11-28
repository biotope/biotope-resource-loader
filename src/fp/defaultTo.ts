import curry from './curry';

const defaultTo = (def, check) => check || def;

export default curry(defaultTo)
