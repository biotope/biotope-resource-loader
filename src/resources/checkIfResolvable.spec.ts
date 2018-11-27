import checkIfResolvable from './checkIfResolvable';
import createResource from '../builders/ResourceBuilder';

describe('#checkDependencies', () => {

    test('returns true for undefined parameters', () => {
        const dependenciesAreResolvable = checkIfResolvable();

        expect(dependenciesAreResolvable).toBeTruthy();
    });

    test('returns true for empty array', () => {
        const dependenciesAreResolvable = checkIfResolvable([]);

        expect(dependenciesAreResolvable).toBeTruthy();
    });

    test('returns true for array without dependencies', () => {
        const dependenciesAreResolvable = checkIfResolvable([
            createResource().build()
        ]);

        expect(dependenciesAreResolvable).toBeTruthy();
    });

    test('returns false for array with unresolvable dependencies', () => {
        const dependenciesAreResolvable = checkIfResolvable([
            createResource().addDependency('dep1').build()
        ]);

        expect(dependenciesAreResolvable).toBeFalsy();
    });

    test('returns true for array with resolvable dependencies', () => {
        const dependenciesAreResolvable = checkIfResolvable([
            createResource().addDependency('dep1').build(),
            createResource().withPath('dep1').build()
        ]);

        expect(dependenciesAreResolvable).toBeTruthy();
    });
})
