import alreadyRegistered from './alreadyRegistered';

describe('#alreadyRegistered', () => {

    test('returns true for undefined parameters', () => {
        const isRegistered = alreadyRegistered(undefined, undefined);

        expect(isRegistered).toBe(true);
    });

    test('returns true if all dependencies are already registered', () => {
        const isRegistered = alreadyRegistered([
            'my/path/resource.css',
            'my/path/resource.js'
        ], [{
            path: 'my/path/resource.css',
            fetch: '',
            hasDependencies: false
        },
        {
            path: 'my/path/resource.js',
            fetch: '',
            hasDependencies: false
        }]);

        expect(isRegistered).toBe(true);
    });

    test('returns false if only one dependencies is not registered', () => {
        const isRegistered = alreadyRegistered([
            'my/path/resource.css',
            'my/path/resource.js'
        ], [{
            path: 'my/path/resource.css',
            fetch: '',
            hasDependencies: false
        }]);

        expect(isRegistered).toBe(false);
    });

    test('returns false if only no dependency is registered', () => {
        const isRegistered = alreadyRegistered([
            'my/path/resource.css',
            'my/path/resource.js'
        ], []);

        expect(isRegistered).toBe(false);
    });
})
