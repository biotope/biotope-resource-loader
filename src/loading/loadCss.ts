import { Dependency } from "../types/internal";
import EVENTS from '../constants/Events';

const isCss = (dependency: Dependency): boolean => dependency.path.indexOf('.css') > -1;

const loadCss = (dependency: Dependency): void => {
    fetch(dependency.path).then(() => {
        const style: HTMLLinkElement = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = dependency.path;
        document.body.append(style);
        style.addEventListener('load', () => {
            // console.log('💅 style ready', style);
            const e: CustomEvent<Dependency> = new CustomEvent(EVENTS.RESOURCE_LOADED, { detail: dependency });
            document.dispatchEvent(e);
        });
    });
}

export {
    isCss
}

export default loadCss;
