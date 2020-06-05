// import { HandleOptions, Handler } from '../types';
// import './Object.assign';
// import './fetch';
import './Array.find';
import './Promise';
import './CustomEvent';
import { ResourceLoader } from './../ResourceLoader';
import { ResourceLoaderOptions } from '../types';

window['resourceLoader'] = function (options: ResourceLoaderOptions) {
    const loader = new ResourceLoader({
      ...options,
    });

    return loader;
};
