const getResourceElements = (container: ParentNode = document): HTMLElement[] => [].slice.call(container.querySelectorAll('[data-resources]'));

export default getResourceElements;
