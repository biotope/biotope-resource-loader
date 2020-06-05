import { BaseMap } from '../types';
import { JSDOM } from 'jsdom';
import normalizePath from './normalizePath';
import createIdentifiableResourceDefinition from '../builders/ComponentDefinitionBuilder';
import { defaultOptions } from '../defaultOptions';

describe('#normalizePath', () => {

    afterEach(() => {
        delete global['window'];
        const window = (new JSDOM(``, { url: 'http://localhost' })).window;
        global['window'] = window;
    })

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
            const resourceDefinition = createIdentifiableResourceDefinition().withBase('##content').build();
            const normalized = normalizePath(relativePath, resourceDefinition, {
                ...defaultOptions,
                baseMap
            });
            expect(normalized).toBe('http://localhost/hello/world.js');
        });

        it('returns resolved url with absolute url from baseMap', () => {
            const relativePath = 'hello/world.js';
            const baseMap: BaseMap = {
                '##content': 'http://content/url'
            };
            const resourceDefinition = createIdentifiableResourceDefinition().withBase('##content').build();
            const normalized = normalizePath(relativePath, resourceDefinition, {
                ...defaultOptions,
                baseMap
            });
            expect(normalized).toBe('http://content/url/hello/world.js');
        });
    });

    describe('with base set in options', () => {

        it('returns same path for root path', () => {
            const rootPath = '/hello/world.js';
            const resourceDefinition = createIdentifiableResourceDefinition().build();
            const normalized = normalizePath(rootPath, resourceDefinition, {
                ...defaultOptions,
                base: '/resources/'
            });
            expect(normalized).toBe('http://localhost/hello/world.js');
        });

        it('returns path with base appended for html page', () => {
            delete global['window'];
            const window = (new JSDOM(``, { url: 'https://example.org/index.html' })).window;
            global['window'] = window;
            const rootPath = 'hello/world.js';
            const resourceDefinition = createIdentifiableResourceDefinition().build();
            const normalized = normalizePath(rootPath, resourceDefinition, {
                ...defaultOptions,
                base: 'resources/'
            });
            expect(normalized).toBe('https://example.org/resources/hello/world.js');
        });

        it('returns path with base appended for html page with hash', () => {
            delete global['window'];
            const window = (new JSDOM(``, { url: 'https://example.org/index.html#' })).window;
            global['window'] = window;
            const rootPath = 'hello/world.js';
            const resourceDefinition = createIdentifiableResourceDefinition().build();
            const normalized = normalizePath(rootPath, resourceDefinition, {
                ...defaultOptions,
                base: 'resources/'
            });
            expect(normalized).toBe('https://example.org/resources/hello/world.js');
        });
    });
})
