var resourceLoaderOptions = {
    base: '/demo/resources/',
    container: document.querySelector('.wrapper'),
    baseMap: {
        '##content': '/demo/resources-content/'
    }
};


const mainResourceLoader = resourceLoader(resourceLoaderOptions);
