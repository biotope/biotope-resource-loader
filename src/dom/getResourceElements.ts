const getResourceElements = (container: ParentNode = document, resourceListAttributeSelector: string): HTMLElement[] => [].slice.call(container.querySelectorAll(`[${resourceListAttributeSelector}]`));

export default getResourceElements;
