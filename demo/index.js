const cssHandler = {
    match: (options) => options.resource.path.indexOf('.css') > -1,
    handle: (options) => {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = options.resource.path;
        document.body.append(style);
        console.log('💅 style ready', style);
    }
}

const jsHandler = {
    match: (options) => options.resource.path.indexOf('.js') > -1,
    handle: (options) => {
        const script = document.createElement('script');
        script.src = options.resource.path;
        script.async = true;
        document.body.append(script);
        console.log('📖 script ready', script);
    }
}

const htmlHandler = {
    match: (options) => options.resource.path.indexOf('.html') > -1,
    handle: (options) => {
        options.response.text().then((text) => {
            options.resource.elements.forEach(el => {
                el.innerHTML = text;
                new ResourceLoader({
                    ...resourceLoaderOptions,
                    container: el
                });
            });
        });
    }
}

const resourceLoaderOptions = {
    base: '/demo/resources/',
    container: document.querySelector('.wrapper'),
    baseMap: {
        '##content': '/demo/resources-content/'
    },
    handler: [
        cssHandler,
        jsHandler,
        htmlHandler
    ]
};


const mainResourceLoader = new ResourceLoader(resourceLoaderOptions);
