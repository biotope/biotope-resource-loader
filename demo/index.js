const cssHandler = {
    match: (resource) => resource.path.indexOf('.css') > -1,
    handle: (resource) => {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = resource.path;
        document.body.append(style);
        console.log('💅 style ready', style);
    }
}

const jsHandler = {
    match: (resource) => resource.path.indexOf('.js') > -1,
    handle: (resource) => {
        const script = document.createElement('script');
        script.src = resource.path;
        script.async = true;
        document.body.append(script);
        console.log('📖 script ready', script);
    }
}

const htmlHandler = {
    match: (resource) => resource.path.indexOf('.html') > -1,
    handle: (resource) => {
        console.log('Hello HTML');
    }
}


const resourceLoader = new ResourceLoader({
    base: '/demo/resources/',
    container: '.wrapper',
    baseMap: {
        '##content': '/demo/resources-content/'
    }
});



