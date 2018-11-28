import isAbsolute from "./isAbsolute";
import isRootPath from "./isRootPath";
import ensureTrailingSlash from './ensureTrailingSlash';
import ensureNoLeadingSlash from './ensureNoLeadingSlash';
import pipe from '../fp/pipe';
import defaultTo from '../fp/defaultTo';
import identity from '../fp/identity';
import concat from '../fp/concat';
import always from '../fp/always';
import cond from '../fp/cond';

interface ReducedLocation {
    href: string;
    origin: string;
}

const defaultToEmptyString = defaultTo('');
const ensureAbsolutePath = (location: ReducedLocation) => cond([
    [isAbsolute, identity],
    [isRootPath, pipe(
        ensureNoLeadingSlash,
        concat(ensureTrailingSlash(location.origin))
    )],
    [always, pipe(
        ensureNoLeadingSlash,
        concat(ensureTrailingSlash(location.href))
    )]
]);

const createEnsureAbsolutePath = (location: ReducedLocation) => pipe(
    defaultToEmptyString,
    ensureAbsolutePath(location)
);

export default createEnsureAbsolutePath;
