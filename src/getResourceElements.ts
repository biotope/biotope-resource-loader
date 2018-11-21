const getResourceElements = (container: ParentNode): HTMLElement[] => container ? [].slice.call(container.querySelectorAll('[data-resources]')) : [];

export default getResourceElements;
