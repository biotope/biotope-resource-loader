import { ResourceLoader } from './ResourceLoader';
import { ResourceLoaderOptions } from './types';

window['resourceLoader'] = (options: ResourceLoaderOptions) => {
    const cssHandler = {
        match: (options) => (options.resource.path.indexOf('.css') >= -1 && options.resource.path.indexOf('.css') >= options.resource.path.length -4),
        handle: (options) => {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = options.resource.path;
            document.head.append(style);
        }
    }

    const jsHandler = {
        match: (options) => options.resource.path.indexOf('.js') > -1 && options.resource.path.indexOf('.js') >= options.resource.path.length -4,
        handle: (options) => {
            const script = document.createElement('script');
            script.src = options.resource.path;
            script.async = true;
            document.head.append(script);
        }
    }

    return new ResourceLoader({
        ...options,
        handler: [
            cssHandler,
            jsHandler
        ]
    });
};
