import { FETCH_STATUS } from './constants';
import { Dependency } from './types';

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

const isCss = (dependency: Dependency): boolean => dependency.path.indexOf('.css') > -1;
const isJs = (dependency: Dependency): boolean => dependency.path.indexOf('.js') > -1;

const loadCss = (dependency: Dependency): void => {
  fetch(dependency.path).then(() => {
    const style: HTMLLinkElement = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = dependency.path;
    document.body.append(style);
    style.addEventListener('load', () => {
      // console.log('💅 style ready', style);
      const e = new CustomEvent('packageLoaded', { detail: dependency });
      document.dispatchEvent(e);
    });
  });
}

const loadJs = (dependency: Dependency): void => {
  const script: HTMLScriptElement = document.createElement('script');
  script.src = dependency.path;
  script.async = true;
  document.body.append(script);
  script.addEventListener('load', () => {
    // console.log('📖 script ready', script);
    const e: CustomEvent = new CustomEvent('packageLoaded', { detail: dependency });
    document.dispatchEvent(e);
  });
}

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
