import getAllDependencies from './getAllDependencies';
import createResource from '../builders/ResourceBuilder';

describe('#getAllDependencies', () => {
	it('returns empty array for undefined source array', () => {
		const allDeps = getAllDependencies(undefined, undefined);
		expect(allDeps).toEqual([]);
	});

	it('returns empty array for undefined resource', () => {
		const allDeps = getAllDependencies([], undefined);
		expect(allDeps).toEqual([]);
	});

	it('returns empty array for empty source array', () => {
		const allDeps = getAllDependencies([], createResource().build());
		expect(allDeps).toEqual([]);
	});

	it('returns empty array for self reference', () => {
		const resource = createResource().build();
		const allDeps = getAllDependencies([resource], resource);
		expect(allDeps).toEqual([]);
	});

	it('returns direct dependency', () => {
		const dependency = createResource().withPath('dep1').build();
		const resource = createResource().addDependency('dep1').build();
		const allDeps = getAllDependencies([dependency], resource);
		expect(allDeps).toEqual([dependency]);
	});

	it('removes non dependency', () => {
		const dependency = createResource().withPath('dep1').build();
		const resource = createResource().addDependency('dep1').build();
		const nonDependency = createResource().withPath('nonDep').build();
		const allDeps = getAllDependencies([dependency, nonDependency], resource);
		expect(allDeps).toEqual([dependency]);
	});

	it('returns deep dependencies', () => {
		const deepDependency = createResource().withPath('deepDep').build();
		const dependency = createResource().withPath('dep').addDependency('deepDep').build();
		const resource = createResource().addDependency('dep').build();
		const allDeps = getAllDependencies([dependency, deepDependency], resource);
		expect(allDeps).toEqual([dependency, deepDependency]);
	});

	it('correctly returns circular dependencies', () => {
		const circDependency1 = createResource().withPath('circ1').addDependency('circ2').build();
		const circDependency2 = createResource().withPath('circ2').addDependency('circ1').build();
		const resource = createResource().addDependency('circ1').build();
		const allDeps = getAllDependencies([circDependency1, circDependency2], resource);
		expect(allDeps).toEqual([circDependency1, circDependency2]);
	});

	it('correctly returns circular dependency to target', () => {
		const circDependency = createResource().withPath('circ').addDependency('target').build();
		const resource = createResource().withPath('target').addDependency('circ').build();
		const allDeps = getAllDependencies([circDependency, resource], resource);
		expect(allDeps).toEqual([circDependency, resource]);
	});

	it('correctly returns deep circular dependencies', () => {
		const circDependency1 = createResource().withPath('circ1').addDependency('circ2').build();
		const circDependency2 = createResource().withPath('circ2').addDependency('circ3').build();
		const circDependency3 = createResource().withPath('circ3').addDependency('circ1').build();
		const resource = createResource().addDependency('circ1').build();
		const allDeps = getAllDependencies([circDependency1, circDependency2, circDependency3], resource);
		expect(allDeps).toEqual([circDependency1, circDependency2, circDependency3]);
	});
});
