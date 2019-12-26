const getResourceElements = (container: ParentNode = document, resourceListAtrributeSelector: string): HTMLElement[] => [].slice.call(container.querySelectorAll(`[${resourceListAtrributeSelector}]`));

export default getResourceElements;
