import { Handler } from '../types';
import { Resource } from "../types";

const isCss = (resource: Resource): boolean => resource.path.indexOf('.css') > -1;

const onCssLoaded = (resource: Resource): void => {
    const style: HTMLLinkElement = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = resource.path;
    document.body.append(style);
}

const cssHandler: Handler = {
    match: isCss,
    handle: onCssLoaded
}

export default cssHandler;
