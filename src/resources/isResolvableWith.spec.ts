import isResolvableWith from './isResolvableWith';
import createResource from '../builders/ResourceBuilder';

describe('#isResolvableWith', () => {

	test('returns a function', () => {
		const isResolvable = isResolvableWith();

		expect(typeof isResolvable).toBe('function');
	});

	test('returns true for undefined parameters', () => {
		const isResolvable = isResolvableWith();
		const dependenciesAreResolvable = isResolvable();

		expect(dependenciesAreResolvable).toBeTruthy();
	});

	test('returns true for empty array', () => {
		const isResolvable = isResolvableWith([]);
		const dependenciesAreResolvable = isResolvable();

		expect(dependenciesAreResolvable).toBeTruthy();
	});

	test('returns true for array without dependencies', () => {
		const isResolvable = isResolvableWith([createResource().build()]);
		const dependenciesAreResolvable = isResolvable();

		expect(dependenciesAreResolvable).toBeTruthy();
	});

	test('returns false for array with unresolvable dependencies', () => {
		const resource = createResource().addDependency('dep1').build();
		const isResolvable = isResolvableWith([resource]);
		const dependenciesAreResolvable = isResolvable(resource);

		expect(dependenciesAreResolvable).toBeFalsy();
	});

	test('returns true for array with resolvable dependencies', () => {
		const resources = [
			createResource().addDependency('dep1').build(),
			createResource().withPath('dep1').build()
		];
		const isResolvable = isResolvableWith(resources)
		const dependenciesAreResolvable = isResolvable(resources[0]);

		expect(dependenciesAreResolvable).toBeTruthy();
	});

	test('returns false for array with circular dependencies', () => {
		const resources = [
			createResource().withPath('dep1').addDependency('dep2').build(),
			createResource().withPath('dep2').addDependency('dep1').build()
		];
		const isResolvable = isResolvableWith(resources)
		const dependenciesAreResolvable = isResolvable(resources[0]);

		expect(dependenciesAreResolvable).toBeFalsy();
	});

	test('returns false for array with deep circular dependencies', () => {
		const resources = [
			createResource().withPath('dep1').addDependency('dep3').build(),
			createResource().withPath('dep2').addDependency('dep1').build(),
			createResource().withPath('dep3').addDependency('dep2').build()
		];
		const isResolvable = isResolvableWith(resources)
		const dependenciesAreResolvable = isResolvable(resources[0]);

		expect(dependenciesAreResolvable).toBeFalsy();
	});

	test('returns false for array with deep remote circular dependencies', () => {
		const resources = [
			createResource().withPath('dep1').addDependency('dep3').build(),
			createResource().withPath('dep2').addDependency('dep3').build(),
			createResource().withPath('dep3').addDependency('dep2').build()
		];
		const isResolvable = isResolvableWith(resources)
		const dependenciesAreResolvable = isResolvable(resources[0]);

		expect(dependenciesAreResolvable).toBeFalsy();
	});
})
