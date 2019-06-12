import curry from './curry';

const remove = (start: number, deleteCount: number, arr: Array<any>) => {
	const newArr = [...arr];
	newArr.splice(start, deleteCount);
	return newArr;
};

export default curry(remove);
