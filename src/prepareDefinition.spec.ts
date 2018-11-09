import { expect } from 'chai';
import prepareDefinition from './prepareDefinition';

describe.skip('#prepareDefinition', () => {

    it('returns string for undefined', () => {
        const normalized = prepareDefinition(undefined);
        expect(false).to.be.true
    });
})
