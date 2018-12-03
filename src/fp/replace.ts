import curry from './curry';

const replace = (selector: RegExp | string, newValue: string, target: string) => target.replace(selector, newValue);

export default curry(replace);
