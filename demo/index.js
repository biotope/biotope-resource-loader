const resourceLoaderOptions = {
  base: '/demo/resources/',
  container: document.querySelector('.wrapper'),
  baseMap: {
    '##content': '/demo/resources-content/'
  }
};

document.addEventListener('resourcesReady', () => { console.log('Resource ready event fired!'); });

const mainResourceLoader = resourceLoader(resourceLoaderOptions);
