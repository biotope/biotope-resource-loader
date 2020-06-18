import pipe from '../fp/pipe';
import defaultTo from '../fp/defaultTo';
import prop from '../fp/prop';

const getDataResourceFromElement = (element: HTMLElement, resourceListAttributeSelector: string): string => {
    return pipe(
        defaultTo(document.createElement('div')),
        prop('attributes'),
        defaultTo({}),
        prop(resourceListAttributeSelector),
        defaultTo({}),
        prop('value'),
        defaultTo('')
    )(element);
}

export default getDataResourceFromElement;
