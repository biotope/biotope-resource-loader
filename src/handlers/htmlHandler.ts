import { HandleOptions } from './../types';
import { Handler } from '../types';

const isHtml = (options: HandleOptions): boolean => options.resource.path.indexOf('.html') > -1;

const onHtmlLoaded = (options: HandleOptions): void => {
  const elements: HTMLElement[] = [].slice.call(options.resource.elements);

  options.response.text()
    .then(stringOfHtml => {
      const fragment = document.createRange().createContextualFragment(stringOfHtml);
      elements.forEach((element: HTMLElement) => {
        element.appendChild(fragment);
      });
    });
}

const htmlHandler: Handler = {
    match: isHtml,
    handle: onHtmlLoaded
}

export default htmlHandler;
