interface ReducedLocation {
    href: string;
    origin: string;
}
declare const createEnsureAbsolutePath: (location: ReducedLocation) => (x0: {}) => any;
export default createEnsureAbsolutePath;
