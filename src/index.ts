import { ResourceLoader } from './ResourceLoader';
import { ResourceLoaderOptions } from './types';

window['resourceLoader'] = (options: ResourceLoaderOptions) => {
    const cssHandler = {
        match: (options) => options.resource.path.indexOf('.css') > -1,
        handle: (options) => {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = options.resource.path;
			style.charset = 'utf-8';
			style.crossorigin = 'use-credentials';
            document.head.append(style);
        }
    }

    const jsHandler = {
        match: (options) => options.resource.path.indexOf('.js') > -1,
        handle: (options) => {
            const script = document.createElement('script');
            script.src = options.resource.path;
            script.async = true;
            script.charset = 'utf-8';
			script.crossorigin = 'use-credentials';
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
