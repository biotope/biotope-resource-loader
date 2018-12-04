import pipe from '../fp/pipe';
import defaultTo from '../fp/defaultTo';
import prop from '../fp/prop';

const getDataResourceFromElement = pipe(
    defaultTo(document.createElement('div')),
    prop('dataset'),
    prop('resources'),
    defaultTo('')
)

export default getDataResourceFromElement;
