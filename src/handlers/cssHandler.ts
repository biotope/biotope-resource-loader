import { HandleOptions } from './../types';
import { Handler } from '../types';

const isCss = (options: HandleOptions): boolean => options.resource.path.indexOf('.css') > -1;

const onCssLoaded = (options: HandleOptions): void => {
    const style: HTMLLinkElement = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = options.resource.path;
    document.body.append(style);
}

const cssHandler: Handler = {
    match: isCss,
    handle: onCssLoaded
}

export default cssHandler;
