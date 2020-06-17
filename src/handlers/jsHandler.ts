import { HandleOptions } from './../types';
import { Handler } from '../types';

const isJs = (options: HandleOptions): boolean => options.resource.path.indexOf('.js') > -1;

const emitScriptReady = (nodes: HTMLElement[], scriptReadyEventName) => {
  const scriptParsedEvent: CustomEvent = new CustomEvent(scriptReadyEventName, { bubbles: true });
  nodes.forEach((node: Node) => {
    node.dispatchEvent(scriptParsedEvent);
  });
}

const onJsLoaded = (options: HandleOptions): void => {
  const script: HTMLScriptElement = document.createElement('script');
  script.src = options.resource.path;
  script.async = true;
  script.onload = () => emitScriptReady(options.resource.elements, options.scriptReadyEventName);
  script.charset = 'utf-8';
  document.head.append(script);
}

const jsHandler: Handler = {
  match: isJs,
  handle: onJsLoaded
}

export default jsHandler;
