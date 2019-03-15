const resourceLoaderOptions = {
  base: '/demo/resources/',
  container: document.querySelector('.wrapper'),
  baseMap: {
    '##content': '/demo/resources-content/'
  }
};

document.addEventListener('resourcesReady', () => { debugger; });

const mainResourceLoader = resourceLoader(resourceLoaderOptions);
