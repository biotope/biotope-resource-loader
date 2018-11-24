import { expect } from 'chai';
import alreadyRegistered from './alreadyRegistered';

describe('#alreadyRegistered', () => {

    it('returns true for undefined parameters', () => {
        const isRegistered = alreadyRegistered(undefined, undefined);

        expect(isRegistered).to.be.true;
    });

    it('returns true if all dependencies are already registered', () => {
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

        expect(isRegistered).to.be.true;
    });

    it('returns false if only one dependencies is not registered', () => {
        const isRegistered = alreadyRegistered([
            'my/path/resource.css',
            'my/path/resource.js'
        ], [{
            path: 'my/path/resource.css',
            fetch: '',
            hasDependencies: false
        }]);

        expect(isRegistered).to.be.false;
    });

    it('returns false if only no dependency is registered', () => {
        const isRegistered = alreadyRegistered([
            'my/path/resource.css',
            'my/path/resource.js'
        ], []);

        expect(isRegistered).to.be.false;
    });
})
