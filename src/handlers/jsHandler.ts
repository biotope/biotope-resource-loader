import { Handler } from '../types';
import { Resource } from "../types";

const isJs = (resource: Resource): boolean => resource.path.indexOf('.js') > -1;

const onJsLoaded = (resource: Resource): void => {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = resource.path;
    script.async = true;
    document.body.append(script);
}

const jsHandler: Handler = {
    match: isJs,
    handle: onJsLoaded
}

export default jsHandler;
