import resolveBaseWith from './resolveBaseWith';

describe('#resolveBaseWith', () => {

    test('returns function with one argument', () => {
        const baseResolver = resolveBaseWith({});

        expect(typeof baseResolver).toBe('function');
    });

    test('returns normal base path if pattern is not present ', () => {
        const baseResolver = resolveBaseWith({
            '##content': 'resources-content/'
        });
        const base = 'some/base/';

        const result = baseResolver(base);

        expect(result).toBe('some/base/');
    });

    test('returns empty path if pattern does not exist in basemap', () => {
        const baseResolver = resolveBaseWith({

        });
        const base = '##content';

        const result = baseResolver(base);

        expect(result).toBe('');
    });

    test('returns matched path if pattern is present ', () => {
        const baseResolver = resolveBaseWith({
            '##content': 'resources-content/'
        });
        const base = '##content';

        const result = baseResolver(base);

        expect(result).toBe('resources-content/');
    });
})
