import { expect } from 'chai';
import getResourceElements from './getResourceElements';

describe('#getResourceElements', () => {

    it('returns empty array for non existent resource elements', () => {
        const resourceElements = getResourceElements(undefined);
        expect(resourceElements).to.be.empty;
    });

    it('returns an empty array for conteiner with no resource elements', () => {
        const container = document.createElement('div');
        const resourceElements = getResourceElements(container);
        expect(resourceElements).to.be.empty;
    });

    it('returns an array with all resource elements', () => {
        const container = document.createElement('div');
        const resourceTemplate = new Array(5).fill('<div data-resources="{paths: [{}]}"></div>').join('');
        container.innerHTML = resourceTemplate;

        const resourceElements = getResourceElements(container);
        expect(resourceElements).to.have.lengthOf(5)
    });
})
