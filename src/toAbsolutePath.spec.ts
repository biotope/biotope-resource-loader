import { toAbsolutePath } from './toAbsolutePath';
import { expect } from 'chai';

describe('#toAbsolutePath', () => {
    beforeEach(() => {
        global['window'] = {
            location: {
                origin: 'http://www.origin.com',
                href: 'http://www.origin.com/sub/path/'
            }
        };
    })

    it('returns current href for undefined', () => {
        const absolute = toAbsolutePath(undefined);

        expect(absolute).to.eq('http://www.origin.com/sub/path/');
    });

    it('returns absolute url for absolute input', () => {
        const path = 'http://some.url/hello-world';
        const absolute = toAbsolutePath(path);

        expect(absolute).to.eq('http://some.url/hello-world');
    });

    it('adds origin to relative url starting at root', () => {
        const path = '/someurl/hello-world';
        const absolute = toAbsolutePath(path);

        expect(absolute).to.eq('http://www.origin.com/someurl/hello-world');
    });

    it('adds origin to relative url starting at root', () => {
        const path = '/someurl/hello-world';
        const absolute = toAbsolutePath(path);

        expect(absolute).to.eq('http://www.origin.com/someurl/hello-world');
    });

    it('adds href ending with / to relative url', () => {
        const path = 'someurl/hello-world.js';
        const absolute = toAbsolutePath(path);

        expect(absolute).to.eq('http://www.origin.com/sub/path/someurl/hello-world.js');
    });

    it('adds / if missing in href to relative url', () => {
        global['window'].location.href = 'http://www.origin.com/sub/path';
        const path = 'someurl/hello-world.js';
        const absolute = toAbsolutePath(path);

        expect(absolute).to.eq('http://www.origin.com/sub/path/someurl/hello-world.js');
    });
})
