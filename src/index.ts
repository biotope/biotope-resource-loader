import { ResourceLoader } from './ResourceLoader';
import { ResourceLoaderOptions } from './types';

window['resourceLoader'] = (options: ResourceLoaderOptions) => {
    const cssHandler = {
        match: (options) => options.resource.path.indexOf('.css') > -1,
        handle: (options) => {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = options.resource.path;
            document.body.append(style);
        }
    }

    const jsHandler = {
        match: (options) => options.resource.path.indexOf('.js') > -1,
        handle: (options) => {
            const script = document.createElement('script');
            script.src = options.resource.path;
            script.async = true;
            document.body.append(script);
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
