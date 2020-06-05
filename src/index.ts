import { ResourceLoader } from './ResourceLoader';
import { ResourceLoaderOptions } from './types';

window['resourceLoader'] = (options: ResourceLoaderOptions) => {
    return new ResourceLoader({
        ...options
    });
};
