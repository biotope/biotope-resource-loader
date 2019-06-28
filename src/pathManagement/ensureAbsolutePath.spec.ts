import createEnsureAbsolutePath from './ensureAbsolutePath';

describe('#ensureAbsolutePath', () => {
    let ensureAbsolutePath;
    beforeEach(() => {
        ensureAbsolutePath = createEnsureAbsolutePath({
            href: 'http://www.origin.com/sub/path/',
            origin: 'http://www.origin.com/'
        });
    })

    test('returns current href for undefined', () => {
        const absolute = ensureAbsolutePath(undefined);

        expect(absolute).toBe('http://www.origin.com/sub/path/');
    });

    test('returns current href for empty string', () => {
        const absolute = ensureAbsolutePath('');

        expect(absolute).toBe('http://www.origin.com/sub/path/');
    });

    test('returns absolute url for absolute input', () => {
        const path = 'http://some.url/hello-world';
        const absolute = ensureAbsolutePath(path);

        expect(absolute).toBe('http://some.url/hello-world');
    });

    test('adds origin to absolute url without http://', () => {
        const path = '/someurl/hello-world.js';
        const absolute = ensureAbsolutePath(path);

        expect(absolute).toBe('http://www.origin.com/someurl/hello-world.js');
    });

    test('adds href ending with / to relative url', () => {
        const path = 'someurl/hello-world.js';
        const absolute = ensureAbsolutePath(path);

        expect(absolute).toBe('http://www.origin.com/sub/path/someurl/hello-world.js');
    });

    test('adds / if missing in href to relative url', () => {
        ensureAbsolutePath = createEnsureAbsolutePath({
            href: 'http://www.origin.com/sub/path',
            origin: ''
        });
        const path = 'someurl/hello-world.js';
        const absolute = ensureAbsolutePath(path);

        expect(absolute).toBe('http://www.origin.com/sub/path/someurl/hello-world.js');
    });

    test('adds / if missing in origin to root url', () => {
        ensureAbsolutePath = createEnsureAbsolutePath({
            href: '',
            origin: 'http://www.origin.com'
        });
        const path = '/someurl/hello-world.js';
        const absolute = ensureAbsolutePath(path);

        expect(absolute).toBe('http://www.origin.com/someurl/hello-world.js');
    });

    test('ignores html files in path', () => {
        ensureAbsolutePath = createEnsureAbsolutePath({
            href: 'http://www.origin.com/sub/path/file.html',
            origin: ''
        });
        const path = 'someurl/hello-world.js';
        const absolute = ensureAbsolutePath(path);

        expect(absolute).toBe('http://www.origin.com/sub/path/someurl/hello-world.js');
    });

    test('ignores trailing hash in path', () => {
        ensureAbsolutePath = createEnsureAbsolutePath({
            href: 'https://example.org/index.html#',
            origin: ''
        });
        const path = 'resources/hello/world.js';
        const absolute = ensureAbsolutePath(path);

        expect(absolute).toBe('https://example.org/resources/hello/world.js');
    });
})
