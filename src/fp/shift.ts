const shift = (arr: any[]): any[] => {
    const clone = [...arr];
    clone.shift();
    return clone;
};

export default shift;
