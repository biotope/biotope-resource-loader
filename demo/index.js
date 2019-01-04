var resourceLoaderOptions = {
    base: '/demo/resources/',
    container: document.querySelector('.wrapper'),
    baseMap: {
        '##content': '/demo/resources-content/'
    }
};

var mainResourceLoader = resourceLoader(resourceLoaderOptions);
