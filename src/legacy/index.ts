import { HandleOptions, Handler } from '../types';
import './Object.assign';
import './fetch';
import './Array.find';
import './Promise';
import './CustomEvent';
import { ResourceLoader } from './../ResourceLoader';
import { ResourceLoaderOptions } from '../types';

window['resourceLoader'] = function (options: ResourceLoaderOptions) {

    const cssHandler: Handler = {
        match: function (options: HandleOptions) { return options.resource.path.indexOf('.css') > -1 },
        handle: function (options: HandleOptions) {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = options.resource.path;
            document.body.appendChild(style);
        }
    }

    const jsHandler: Handler = {
        match: function (options: HandleOptions) { return options.resource.path.indexOf('.js') > -1 },
        handle: function (options: HandleOptions) {
            const script = document.createElement('script');
            script.src = options.resource.path;
            script.async = true;
            document.body.appendChild(script);
        }
    }

    const htmlHandler: Handler = {
        match: function (options: HandleOptions) { return options.resource.path.indexOf('.html') > -1 },
        handle: function (options: HandleOptions) {
            options.response.text().then((text: string) => {
                options.resource.elements.forEach((element: HTMLElement) => {
                    element.innerHTML = text;
                    loader.update();
                });
            });
        }
    }

    const loader = new ResourceLoader({
        handler: [
            cssHandler,
            jsHandler,
            htmlHandler
        ],
        ...options,
    });

    return loader;
};
