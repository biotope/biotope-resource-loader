import getResourceElements from './getResourceElements';
import { defaultOptions } from '../defaultOptions';

describe('#getResourceElements', () => {

    test('returns empty array for non existent resource elements', () => {
        const resourceElements = getResourceElements(undefined, defaultOptions.resourceListAtrributeSelector);
        expect(Object.keys(resourceElements)).toHaveLength(0);
    });

    test('returns an empty array for container with no resource elements', () => {
        const container = document.createElement('div');
        const resourceElements = getResourceElements(container, defaultOptions.resourceListAtrributeSelector);
        expect(Object.keys(resourceElements)).toHaveLength(0);
    });

    describe('returns an array with all resource elements', () => {
        const buildResourceTemplate = (selectorAttribute: String) => {
            const container = document.createElement('div');
            const resourceTemplate = new Array(5).fill(`<div ${selectorAttribute}="{paths: [{}]}"></div>`).join('');
            container.innerHTML = resourceTemplate;
            return container;
        }

        test('when using the default attribute', () => {
            const container = buildResourceTemplate(defaultOptions.resourceListAtrributeSelector);
            const resourceElements = getResourceElements(container, defaultOptions.resourceListAtrributeSelector);
            expect(resourceElements).toHaveLength(5)
        });

        test('when using a custom attribute', () => {
            const customAttribute = 'arbitrary';
            const container = buildResourceTemplate(customAttribute);
            const resourceElements = getResourceElements(container, customAttribute);
            expect(resourceElements).toHaveLength(5)
        });
    });
})
