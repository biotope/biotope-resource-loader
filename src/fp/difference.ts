import curry from './curry';
import _Set from './Set';

const difference = (first: ReadonlyArray<any>, second: ReadonlyArray<any>) => {

    const out = [];
    let idx = 0;
    const firstLen = first.length;
    const secondLen = second.length;
    const toFilterOut = new _Set();

    for (let i = 0; i < secondLen; i++) {
        toFilterOut.add(second[i]);
    }

    while (idx < firstLen) {
        if (toFilterOut.add(first[idx])) {
            out[out.length] = first[idx];
        }
        idx += 1;
    }

    return out;
}

export default curry(difference);
