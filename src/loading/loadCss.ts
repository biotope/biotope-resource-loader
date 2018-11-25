import { Resource } from "../types/internal";
import EVENTS from '../constants/Events';

const isCss = (resource: Resource): boolean => resource.path.indexOf('.css') > -1;

const loadCss = (resource: Resource): void => {
    fetch(resource.path).then(() => {
        const style: HTMLLinkElement = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = resource.path;
        document.body.append(style);
        style.addEventListener('load', () => {
            // console.log('💅 style ready', style);
            const e: CustomEvent<Resource> = new CustomEvent(EVENTS.RESOURCE_LOADED, { detail: resource });
            document.dispatchEvent(e);
        });
    });
}

export {
    isCss
}

export default loadCss;
