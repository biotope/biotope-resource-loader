import { expect } from 'chai';
import resolveBaseWith from './resolveBaseWith';

describe('#resolveBaseWith', () => {

    it('returns function with one argument', () => {
        const baseResolver = resolveBaseWith({});

        expect(baseResolver).to.be.a('Function');
    });

    it('returns normal base path if pattern is not present ', () => {
        const baseResolver = resolveBaseWith({
            '##content': 'resources-content/'
        });
        const base = 'some/base/';

        const result = baseResolver(base);

        expect(result).to.eq('some/base/');
    });

    it('returns empty path if pattern does not exist in basemap', () => {
        const baseResolver = resolveBaseWith({

        });
        const base = '##content';

        const result = baseResolver(base);

        expect(result).to.eq('');
    });

    it('returns matched path if pattern is present ', () => {
        const baseResolver = resolveBaseWith({
            '##content': 'resources-content/'
        });
        const base = '##content';

        const result = baseResolver(base);

        expect(result).to.eq('resources-content/');
    });
})
