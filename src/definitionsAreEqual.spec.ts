import { expect } from 'chai';
import createDefinition from './ResourceDefinitionBuilder';
import definitionsAreEqual from './definitionsAreEqual';

describe('#definitionsAreEqual', () => {

    it('returns false for both undefined', () => {
        const equal = definitionsAreEqual(undefined, undefined);

        expect(equal).to.be.false;
    });

    it('returns false if only one defintion is passed', () => {
        const mockDefinition = createDefinition().build();
        const equal = definitionsAreEqual(undefined, mockDefinition);

        expect(equal).to.be.false;
    });

    it('returns false if paths are different', () => {
        const mockDefinition1 = createDefinition().addPath('somePath').build();
        const mockDefinition2 = createDefinition().addPath('someOtherPath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).to.be.false;
    });

    it('returns true if paths are equal', () => {
        const mockDefinition1 = createDefinition().addPath('somePath').build();
        const mockDefinition2 = createDefinition().addPath('somePath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).to.be.true;
    });

    it('returns false if dependencies are different', () => {
        const mockDefinition1 = createDefinition().addDependency('somePath').build();
        const mockDefinition2 = createDefinition().addDependency('someOtherPath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).to.be.false;
    });

    it('returns true if dependencies are equal', () => {
        const mockDefinition1 = createDefinition().addDependency('somePath').build();
        const mockDefinition2 = createDefinition().addDependency('somePath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).to.be.true;
    });

    it('returns false if base is different', () => {
        const mockDefinition1 = createDefinition().withBase('somePath').build();
        const mockDefinition2 = createDefinition().withBase('someOtherPath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).to.be.false;
    });

    it('returns true if base is equal', () => {
        const mockDefinition1 = createDefinition().withBase('somePath').build();
        const mockDefinition2 = createDefinition().withBase('somePath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).to.be.true;
    });
})
