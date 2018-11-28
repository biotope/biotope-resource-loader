const unique = (arr: ReadonlyArray<any>) => arr.filter((value, index, self) => self.indexOf(value) === index);

export default unique;
