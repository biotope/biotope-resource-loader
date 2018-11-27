import { Resource } from "../types";

const isCss = (resource: Resource): boolean => resource.path.indexOf('.css') > -1;

const onCssLoaded = (resource: Resource): void => {
    const style: HTMLLinkElement = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = resource.path;
    document.body.append(style);
    console.log('💅 style ready', style);
}

export {
    isCss
}

export default onCssLoaded;
