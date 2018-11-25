import createIdentifiableResourceDefinition from './builders/ResourceDefinitionBuilder';
import definitionsAreEqual from './definitionsAreEqual';

describe('#definitionsAreEqual', () => {

    test('returns false for both undefined', () => {
        const equal = definitionsAreEqual(undefined, undefined);

        expect(equal).toBe(false);
    });

    test('returns false if only one defintion is passed', () => {
        const mockDefinition = createIdentifiableResourceDefinition().build();
        const equal = definitionsAreEqual(undefined, mockDefinition);

        expect(equal).toBe(false);
    });

    test('returns false if paths are different', () => {
        const mockDefinition1 = createIdentifiableResourceDefinition().addPath('somePath').build();
        const mockDefinition2 = createIdentifiableResourceDefinition().addPath('someOtherPath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).toBe(false);
    });

    test('returns true if paths are equal', () => {
        const mockDefinition1 = createIdentifiableResourceDefinition().addPath('somePath').build();
        const mockDefinition2 = createIdentifiableResourceDefinition().addPath('somePath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).toBe(true);
    });

    test('returns false if dependencies are different', () => {
        const mockDefinition1 = createIdentifiableResourceDefinition().addDependency('somePath').build();
        const mockDefinition2 = createIdentifiableResourceDefinition().addDependency('someOtherPath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).toBe(false);
    });

    test('returns true if dependencies are equal', () => {
        const mockDefinition1 = createIdentifiableResourceDefinition().addDependency('somePath').build();
        const mockDefinition2 = createIdentifiableResourceDefinition().addDependency('somePath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).toBe(true);
    });

    test('returns false if base is different', () => {
        const mockDefinition1 = createIdentifiableResourceDefinition().withBase('somePath').build();
        const mockDefinition2 = createIdentifiableResourceDefinition().withBase('someOtherPath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).toBe(false);
    });

    test('returns true if base is equal', () => {
        const mockDefinition1 = createIdentifiableResourceDefinition().withBase('somePath').build();
        const mockDefinition2 = createIdentifiableResourceDefinition().withBase('somePath').build();

        const equal = definitionsAreEqual(mockDefinition1, mockDefinition2);

        expect(equal).toBe(true);
    });
})
