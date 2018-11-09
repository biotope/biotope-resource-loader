import { expect } from 'chai';
import queuesAreEqual from './queuesAreEqual';
import createQueue from './builders/ResourceQueueBuilder';
import createDefinition from './builders/ResourceDefinitionBuilder';

describe('#areEqual', () => {

    it('returns true for undefined', () => {
        const equal = queuesAreEqual(undefined, undefined);

        expect(equal).to.be.true;
    });

    it('returns true if one queue is not set', () => {
        const mockQueue = createQueue().build();
        const equal = queuesAreEqual(mockQueue, undefined);

        expect(equal).to.be.true;
    });

    it('returns true if both queues are empty', () => {
        const mockQueue1 = createQueue().build();
        const mockQueue2 = createQueue().build();
        const equal = queuesAreEqual(mockQueue1, mockQueue2);

        expect(equal).to.be.true;
    });

    it('returns true if both queues are equal', () => {
        const mockDefinition = createDefinition().withBase('hello/world').addPath('somePath').build();
        const mockQueue1 = createQueue().addDefinition({ ...mockDefinition }).build();
        const mockQueue2 = createQueue().addDefinition({ ...mockDefinition }).build();
        const equal = queuesAreEqual(mockQueue1, mockQueue2);

        expect(equal).to.be.true;
    });

    it('returns false if both queues are different length', () => {
        const mockDefinition = createDefinition().withBase('hello/world').addPath('somePath').build();
        const mockQueue1 = createQueue().addDefinition({ ...mockDefinition }).addDefinition({ ...mockDefinition }).build();
        const mockQueue2 = createQueue().addDefinition({ ...mockDefinition }).build();
        const equal = queuesAreEqual(mockQueue1, mockQueue2);

        expect(equal).to.be.false;
    });

    it('returns false if both queues have different contents', () => {
        const mockDefinition1 = createDefinition().withBase('hello/world').addPath('somePath').build();
        const mockDefinition2 = createDefinition().addPath('someOtherPath').addPath('somePath').build();
        const mockQueue1 = createQueue().addDefinition({ ...mockDefinition1 }).build();
        const mockQueue2 = createQueue().addDefinition({ ...mockDefinition2 }).build();
        const equal = queuesAreEqual(mockQueue1, mockQueue2);

        expect(equal).to.be.false;
    });
})
