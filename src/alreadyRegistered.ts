import { Dependency } from "./types/internal";

// not really necessary but important for perf?
// returns true if all dependencies of a path are already lined up
const alreadyRegistered = (paths: string[] = [], requests: Dependency[] = []) => paths.every((p) => requests.some(r => r.path === p));

export default alreadyRegistered;
