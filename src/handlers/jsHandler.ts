import { HandleOptions } from './../types';
import { Handler } from '../types';

const isJs = (options: HandleOptions): boolean => options.resource.path.indexOf('.js') > -1;

const emitScriptParsed = (nodes: HTMLElement[]) => {
  const scriptParsedEvent: CustomEvent = new CustomEvent('scriptParsed', { bubbles: true });
  nodes.forEach((node: Node) => {
    node.dispatchEvent(scriptParsedEvent);
  });
}

const onJsLoaded = (options: HandleOptions): void => {
  console.log(options);
  const script: HTMLScriptElement = document.createElement('script');
  script.src = options.resource.path;
  script.async = true;
  script.onload = () => emitScriptParsed(options.resource.elements);
  document.body.append(script);
}

const jsHandler: Handler = {
  match: isJs,
  handle: onJsLoaded
}

export default jsHandler;
