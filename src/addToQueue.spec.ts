import addToQueue from './addToQueue';
import createResource from './builders/ResourceBuilder';
import createIdentifiableResourceDefinition from './builders/IdentifiableResourceDefinitionBuilder';

describe('#addToQueue', () => {
    it('returns empty array for all undefined', () => {
        const queue = addToQueue();

        expect(queue.map).toBeDefined();
        expect(queue).toHaveLength(0);
    });

    it('returns existing queue when definitions are undefined', () => {
        const queue = addToQueue(undefined, [
            createResource().build()
        ]);

        expect(queue).toHaveLength(1);
    });

    it('puts resources without dependencies to the front', () => {
        const queue = addToQueue([
            createIdentifiableResourceDefinition().addPath('with/dependency').addDependency('').build(),
            createIdentifiableResourceDefinition().addPath('without/dependency').build()
        ]);

        expect(queue[0].hasDependencies).toBeFalsy();
    });
});
