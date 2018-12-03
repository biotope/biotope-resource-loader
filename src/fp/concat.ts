import curry from './curry';

const concat = (t1: string, t2: string) => t1 + t2;

export default curry(concat);
