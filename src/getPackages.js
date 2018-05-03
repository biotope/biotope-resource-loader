const prewarmCache = path => {
  fetch(path);
};

const attachToDom = dependency => {
  const type = dependency.path.indexOf('.css') > -1 ? 'css' : 'js';
  if (type === 'css') {
    fetch(dependency.path).then(() => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.async = true;
      style.href = dependency.path;
      document.body.append(style);
      style.addEventListener('load', () => {
        // console.log('💅 style ready', style);
        const e = new CustomEvent('packageLoaded', { detail: dependency });
        document.dispatchEvent(e);
      });
    });
  } else {
    const script = document.createElement('script');
    script.src = dependency.path;
    script.async = true;
    document.body.append(script);
    script.addEventListener('load', () => {
      // console.log('📖 script ready', script);
      const e = new CustomEvent('packageLoaded', { detail: dependency });
      document.dispatchEvent(e);
    });
  }
};

const getPackages = (urls, byPassCache = false) => {
  for (const url of urls) {
    if (url.hasDependencies && !byPassCache) {
      prewarmCache(url.path);
    } else {
      attachToDom(url);
    }
  }
};

export default getPackages;
