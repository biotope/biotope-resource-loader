import pipe from '../fp/pipe';
import defaultTo from '../fp/defaultTo';
import prop from '../fp/prop';

const getDataResourceFromElement = (element: HTMLElement, resourceListAtrributeSelector: string): string => {
    return pipe(
        defaultTo(document.createElement('div')),
        prop('attributes'),
        defaultTo({}),
        prop(resourceListAtrributeSelector),
        defaultTo({}),
        prop('value'),
        defaultTo('')
    )(element);
}

export default getDataResourceFromElement;
