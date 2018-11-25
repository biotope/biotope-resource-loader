import { Resource } from "../types/internal";
import EVENTS from '../constants/Events';

const isJs = (resource: Resource): boolean => resource.path.indexOf('.js') > -1;

const loadJs = (resource: Resource): void => {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = resource.path;
    script.async = true;
    document.body.append(script);
    script.addEventListener('load', () => {
        // console.log('📖 script ready', script);
        const e: CustomEvent<Resource> = new CustomEvent(EVENTS.RESOURCE_LOADED, { detail: resource });
        document.dispatchEvent(e);
    });
}

export {
    isJs
}

export default loadJs;
