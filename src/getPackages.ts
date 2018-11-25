import { FETCH_STATUS } from './constants/FetchStatus';
import { Dependency } from './types/external';
import loadJs from './loading/loadJs';
import loadCss, { isCss } from './loading/loadCss';

const prewarmCache = (path: string) => {
  fetch(path);
};

const attachToDom = (dependency: Dependency) => {
  if (isCss(dependency)) {
    loadCss(dependency);
  } else {
    loadJs(dependency);
  }
};

const isPending = (dependency: Dependency) => dependency.fetch === FETCH_STATUS.PENDING;

const getPackages = (dependencies: Dependency[], byPassCache: boolean = false): void => {
  const pendingDependencies = dependencies.filter(isPending);

  pendingDependencies.map((dependency: Dependency) => {
    if (dependency.hasDependencies && !byPassCache) {
      prewarmCache(dependency.path);
    } else {
      attachToDom(dependency);
    }
  })
};

export default getPackages;
