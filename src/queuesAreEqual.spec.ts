import queuesAreEqual from './queuesAreEqual';
import createIdentitfiableComponentQueue from './builders/ResourceQueueBuilder';
import createIdentifiableResourceDefinition from './builders/ResourceDefinitionBuilder';

describe('#areEqual', () => {

    test('returns true for undefined', () => {
        const equal = queuesAreEqual(undefined, undefined);

        expect(equal).toBe(true);
    });

    test('returns true if one queue is not set', () => {
        const mockQueue = createIdentitfiableComponentQueue().build();
        const equal = queuesAreEqual(mockQueue, undefined);

        expect(equal).toBe(true);
    });

    test('returns true if both queues are empty', () => {
        const mockQueue1 = createIdentitfiableComponentQueue().build();
        const mockQueue2 = createIdentitfiableComponentQueue().build();
        const equal = queuesAreEqual(mockQueue1, mockQueue2);

        expect(equal).toBe(true);
    });

    test('returns true if both queues are equal', () => {
        const mockDefinition = createIdentifiableResourceDefinition().withBase('hello/world').addPath('somePath').build();
        const mockQueue1 = createIdentitfiableComponentQueue().addDefinition({ ...mockDefinition }).build();
        const mockQueue2 = createIdentitfiableComponentQueue().addDefinition({ ...mockDefinition }).build();
        const equal = queuesAreEqual(mockQueue1, mockQueue2);

        expect(equal).toBe(true);
    });

    test('returns false if both queues are different length', () => {
        const mockDefinition = createIdentifiableResourceDefinition().withBase('hello/world').addPath('somePath').build();
        const mockQueue1 = createIdentitfiableComponentQueue().addDefinition({ ...mockDefinition }).addDefinition({ ...mockDefinition }).build();
        const mockQueue2 = createIdentitfiableComponentQueue().addDefinition({ ...mockDefinition }).build();
        const equal = queuesAreEqual(mockQueue1, mockQueue2);

        expect(equal).toBe(false);
    });

    test('returns false if both queues have different contents', () => {
        const mockDefinition1 = createIdentifiableResourceDefinition().withBase('hello/world').addPath('somePath').build();
        const mockDefinition2 = createIdentifiableResourceDefinition().addPath('someOtherPath').addPath('somePath').build();
        const mockQueue1 = createIdentitfiableComponentQueue().addDefinition({ ...mockDefinition1 }).build();
        const mockQueue2 = createIdentitfiableComponentQueue().addDefinition({ ...mockDefinition2 }).build();
        const equal = queuesAreEqual(mockQueue1, mockQueue2);

        expect(equal).toBe(false);
    });
})
