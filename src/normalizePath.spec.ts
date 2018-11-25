import { BaseMap } from './types';
import normalizePath from './normalizePath';
import createDefinition from './builders/ResourceDefinitionBuilder';

describe('#normalizePath', () => {

    it('returns empty string for undefined', () => {
        const normalized = normalizePath(undefined, undefined, undefined);
        expect(normalized).toBe('');
    });

    it('returns same path for absolute path', () => {
        const absolutePath = '/hello/world.js'
        const normalized = normalizePath(absolutePath, undefined, undefined);
        expect(normalized).toBe('/hello/world.js');
    });

    it('returns same path for relative path without resource base set', () => {
        const relativePath = 'hello/world.js';
        const normalized = normalizePath(relativePath, undefined, undefined);
        expect(normalized).toBe('hello/world.js');
    });

    describe('with resource base', () => {
        it('returns same path for relative path with empty baseMap', () => {
            const relativePath = 'hello/world.js';
            const baseMap: BaseMap = {};
            const resourceDefinition = createDefinition().withBase('##content').build();
            const normalized = normalizePath(relativePath, resourceDefinition, {
                container: '',
                readyEvent: '',
                baseMap
            });
            expect(normalized).toBe('http://localhost/hello/world.js');
        });

        it('returns resolved url with absolute url from baseMap', () => {
            const relativePath = 'hello/world.js';
            const baseMap: BaseMap = {
                '##content': 'http://content/url'
            };
            const resourceDefinition = createDefinition().withBase('##content').build();
            const normalized = normalizePath(relativePath, resourceDefinition, {
                container: '',
                readyEvent: '',
                baseMap
            });
            expect(normalized).toBe('http://content/url/hello/world.js');
        });
    })
})
