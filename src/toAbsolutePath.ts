import isAbsolute from "./helper/isAbsolute";
import isRootPath from "./helper/isRootPath";
import { defaultTo, cond, concat, identity, T, pipe } from 'ramda';
import ensureTrailingSlash from './helper/ensureTrailingSlash';
import ensureNoLeadingSlash from './helper/ensureNoLeadingSlash';

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
    [T, pipe(
        ensureNoLeadingSlash,
        concat(ensureTrailingSlash(location.href))
    )]
]);

const createEnsureAbsolutePath = (location: ReducedLocation) => pipe(
    defaultToEmptyString,
    ensureAbsolutePath(location)
);

export default createEnsureAbsolutePath;
