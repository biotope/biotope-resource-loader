const getResourceElements = (container: ParentNode): HTMLElement[] => [].slice.call(container.querySelectorAll('[data-resources]'));

export default getResourceElements;
