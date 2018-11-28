const unnest = (arr: any[]): any[] => [].concat.apply([], arr);

export default unnest;
