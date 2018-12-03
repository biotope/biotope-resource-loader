import { HandleOptions } from './../types';
import { Handler } from '../types';

const isJs = (options: HandleOptions): boolean => options.resource.path.indexOf('.js') > -1;

const onJsLoaded = (options: HandleOptions): void => {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = options.resource.path;
    script.async = true;
    document.body.append(script);
}

const jsHandler: Handler = {
    match: isJs,
    handle: onJsLoaded
}

export default jsHandler;
