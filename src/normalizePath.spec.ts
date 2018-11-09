import { expect } from 'chai';
import normalizePath from './normalizePath';

describe.skip('#normalizePath', () => {

    it('returns string for undefined', () => {
        const normalized = normalizePath(undefined, undefined, undefined);
        expect(false).to.be.true
    });
})
