const simpleArraysAreEqual = (arr1 = [], arr2 = []) => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((item, index) => item === arr2[index]);
}

export default simpleArraysAreEqual;
