import { FETCH_STATUS } from './constants/FetchStatus';
import { Resource } from './types/internal';
import loadJs from './loading/loadJs';
import loadCss, { isCss } from './loading/loadCss';
import { pipe, prop, equals, cond, T } from 'ramda';

const prewarmCache = (path: string) => {
  fetch(path);
};

const attachToDom = cond([
  [isCss, loadCss],
  [T, loadJs]
])

const isPending = pipe<Resource, string, boolean>(
  prop('fetchStatus'),
  equals(FETCH_STATUS.PENDING)
);

const loadResources = (dependencies: Resource[], byPassCache: boolean = false): void => {
  const pendingDependencies = dependencies.filter(isPending);

  pendingDependencies.forEach((dependency: Resource) => {
    if (dependency.hasDependencies && !byPassCache) {
      prewarmCache(dependency.path);
    } else {
      attachToDom(dependency);
    }
  })
};

export default loadResources;
