const curry = (fn: Function) => {
    return (...xs) => {
        if (xs.length === 0) {
            throw Error('EMPTY INVOCATION');
        }
        if (xs.length >= fn.length) {
            return fn(...xs);
        }
        return curry(fn.bind(null, ...xs));
    };
}

export default curry;
