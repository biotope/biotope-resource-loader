import { HandleOptions } from './../types';
import { Handler } from '../types';

const isJs = (options: HandleOptions): boolean => options.resource.path.indexOf('.js') > -1;

const emitScriptParsed = (nodes: HTMLElement[], scriptsParsedEvent) => {
  const scriptParsedEvent: CustomEvent = new CustomEvent(scriptsParsedEvent, { bubbles: true });
  nodes.forEach((node: Node) => {
    node.dispatchEvent(scriptParsedEvent);
  });
}

const onJsLoaded = (options: HandleOptions): void => {
  const script: HTMLScriptElement = document.createElement('script');
  script.src = options.resource.path;
  script.async = true;
  script.onload = () => emitScriptParsed(options.resource.elements, options.scriptParsedEvent);
  document.body.append(script);
}

const jsHandler: Handler = {
  match: isJs,
  handle: onJsLoaded
}

export default jsHandler;
