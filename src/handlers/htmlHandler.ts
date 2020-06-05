import { HandleOptions } from './../types';
import { Handler } from '../types';

const isHtml = (options: HandleOptions): boolean => options.resource.path
  .slice(-'.html'.length) === '.html';

const emitHtmlReady = (node: HTMLElement, htmlReadyEventName) => {
  const scriptParsedEvent: CustomEvent = new CustomEvent(htmlReadyEventName, { bubbles: true });
  node.dispatchEvent(scriptParsedEvent);
}

const onHtmlLoaded = (options: HandleOptions): void => {
  const elements: HTMLElement[] = [].slice.call(options.resource.elements);

  options.response.text().then(stringOfHtml => {
      const fragment = document.createRange().createContextualFragment(stringOfHtml);
      elements.forEach((element: HTMLElement) => {
        element.appendChild(fragment);
        emitHtmlReady(element, options.htmlReadyEventName);
      });
    });
}

const htmlHandler: Handler = {
    match: isHtml,
    handle: onHtmlLoaded
}

export default htmlHandler;
