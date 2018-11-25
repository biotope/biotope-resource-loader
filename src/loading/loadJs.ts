import { Dependency } from "../types/internal";
import EVENTS from '../constants/Events';

const isJs = (dependency: Dependency): boolean => dependency.path.indexOf('.js') > -1;

const loadJs = (dependency: Dependency): void => {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = dependency.path;
    script.async = true;
    document.body.append(script);
    script.addEventListener('load', () => {
        // console.log('📖 script ready', script);
        const e: CustomEvent<Dependency> = new CustomEvent(EVENTS.RESOURCE_LOADED, { detail: dependency });
        document.dispatchEvent(e);
    });
}

export {
    isJs
}

export default loadJs;
