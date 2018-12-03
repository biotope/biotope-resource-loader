import curry from './curry';

const remove = (start: number, deleteCount: number, arr: ReadonlyArray<any>) => [...arr].splice(start, deleteCount);

export default curry(remove);
