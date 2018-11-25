import getResourceElements from './getResourceElements';

describe('#getResourceElements', () => {

    test('returns empty array for non existent resource elements', () => {
        const resourceElements = getResourceElements(undefined);
        expect(Object.keys(resourceElements)).toHaveLength(0);
    });

    test('returns an empty array for conteiner with no resource elements', () => {
        const container = document.createElement('div');
        const resourceElements = getResourceElements(container);
        expect(Object.keys(resourceElements)).toHaveLength(0);
    });

    test('returns an array with all resource elements', () => {
        const container = document.createElement('div');
        const resourceTemplate = new Array(5).fill('<div data-resources="{paths: [{}]}"></div>').join('');
        container.innerHTML = resourceTemplate;

        const resourceElements = getResourceElements(container);
        expect(resourceElements).toHaveLength(5)
    });
})
