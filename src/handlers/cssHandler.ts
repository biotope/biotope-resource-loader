import { HandleOptions } from './../types';
import { Handler } from '../types';

const isCss = (options: HandleOptions): boolean => options.resource.path.indexOf('.css') > -1;

const emitStyleReady = (nodes: HTMLElement[], styleReadyEventName) => {
  const scriptParsedEvent: CustomEvent = new CustomEvent(styleReadyEventName, { bubbles: true });
  nodes.forEach((node: Node) => {
    node.dispatchEvent(scriptParsedEvent);
  });
}

const onCssLoaded = (options: HandleOptions): void => {
    const style: HTMLLinkElement = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = options.resource.path;
    style.onload = () => emitStyleReady(options.resource.elements, options.scriptReadyEventName);
    document.body.append(style);
}

const cssHandler: Handler = {
    match: isCss,
    handle: onCssLoaded
}

export default cssHandler;
