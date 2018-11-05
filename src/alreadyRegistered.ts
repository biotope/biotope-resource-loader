// not really necessary but important for perf?
// returns true if all dependencies of a path are already lined up
// ⚠️ TODO: Add interface Dependency to requests
const alreadyRegistered = (paths: string[] = [], requests: any[] = []) => paths.every((p) => requests.some(r => r.path === p));

export default alreadyRegistered;
