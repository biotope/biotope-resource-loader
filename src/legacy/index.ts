import './Object.assign';
import './fetch';
import './Array.find';
import './Promise';
import './CustomEvent';
import { ResourceLoader } from './../ResourceLoader';
import { ResourceLoaderOptions } from '../types';

window['resourceLoader'] = function (options: ResourceLoaderOptions) {
    var cssHandler = {
        match: function (options) { return options.resource.path.indexOf('.css') > -1 },
        handle: function (options) {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = options.resource.path;
            document.body.appendChild(style);
        }
    }

    var jsHandler = {
        match: function (options) { return options.resource.path.indexOf('.js') > -1 },
        handle: function (options) {
            const script = document.createElement('script');
            script.src = options.resource.path;
            script.async = true;
            document.body.appendChild(script);
        }
    }

    new ResourceLoader(Object.assign({}, options, {
        handler: [
            cssHandler,
            jsHandler
        ]
    }));
};
