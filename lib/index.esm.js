const EVENTS = {
    RESOURCE_LOADED: 'RESOURCE_LOADED',
    COMPONENT_READY: 'COMPONENT_READY'
};

const getResourceElements = (container = document) => [].slice.call(container.querySelectorAll('[data-resources]'));

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const curry = (fn) => {
    return (...xs) => {
        if (xs.length === 0) {
            throw Error('EMPTY INVOCATION');
        }
        if (xs.length >= fn.length) {
            return fn(...xs);
        }
        return curry(fn.bind(null, ...xs));
    };
};

const defaultTo = (def, check) => check || def;
var defaultTo$1 = curry(defaultTo);

const prop = (key, obj) => obj[key];
var prop$1 = curry(prop);

const getDataResourceFromElement = pipe(defaultTo$1(document.createElement('div')), prop$1('dataset'), prop$1('resources'), defaultTo$1(''));

const getComponentQueueFromElement = (element = document.createElement('div')) => {
    const dataResources = getDataResourceFromElement(element);
    const definitions = eval(dataResources) || [];
    return definitions.map((d) => (Object.assign({}, d, { element })));
};

const unnest = (arr) => [].concat.apply([], arr);

const getContentDefinitionsFromDOM = (container = document) => {
    const domResources = getResourceElements(container);
    return unnest(domResources.map(getComponentQueueFromElement));
};

const unique = (arr) => arr.filter((value, index, self) => self.indexOf(value) === index);

const mergeResources = (resources = []) => {
    return resources.reduce((aggregated, current) => {
        if (aggregated.map(r => r.path).indexOf(current.path) !== -1) {
            return aggregated;
        }
        return [
            ...aggregated,
            Object.assign({}, current, { dependencyPaths: unique(unnest(resources.filter(r => r.path === current.path).map(r => r.dependencyPaths || []))), elements: unique(unnest(resources.filter(r => r.path === current.path).map(r => r.elements || []))) })
        ];
    }, []);
};

const resolveBaseWith = (baseMap, base) => {
    if (!(base.substring(0, 2) === '##')) {
        return base;
    }
    return baseMap[base] || '';
};
var resolveBaseWith$1 = curry(resolveBaseWith);

const isAbsolute = (path) => new RegExp('^(?:[a-z]+:)?//', 'i').test(path);

const isRootPath = (path) => path.indexOf('/') === 0 && path.indexOf('//') !== 0;

const getTrailingSlashesRegex = () => /\/?$/;
const getLeadingSlashesRegex = () => /^\/?/;

const replace = (selector, newValue, target) => target.replace(selector, newValue);
var replace$1 = curry(replace);

const ensureTrailingSlash = replace$1(getTrailingSlashesRegex(), '/');

const ensureNoLeadingSlash = replace$1(getLeadingSlashesRegex(), '');

const identity = (el) => el;

const concat = (t1, t2) => t1 + t2;
var concat$1 = curry(concat);

const always = () => true;

const max = (a, b) => b > a ? b : a;
const _arity = (n, fn) => {
    switch (n) {
        case 0: return function () { return fn.apply(this, arguments); };
        case 1: return function (a0) { return fn.apply(this, arguments); };
        case 2: return function (a0, a1) { return fn.apply(this, arguments); };
        case 3: return function (a0, a1, a2) { return fn.apply(this, arguments); };
        case 4: return function (a0, a1, a2, a3) { return fn.apply(this, arguments); };
        case 5: return function (a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
        case 6: return function (a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
        case 7: return function (a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
        case 8: return function (a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
        case 9: return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
        case 10: return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
        default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
    }
};
const cond = (pairs) => {
    const arity = pairs.map((pair) => pair[0].length).reduce(max, 0);
    return _arity(arity, function () {
        var idx = 0;
        while (idx < pairs.length) {
            if (pairs[idx][0].apply(this, arguments)) {
                return pairs[idx][1].apply(this, arguments);
            }
            idx += 1;
        }
    });
};
var cond$1 = curry(cond);

const defaultToEmptyString = defaultTo$1('');
const ensureAbsolutePath = (location) => cond$1([
    [isAbsolute, identity],
    [isRootPath, pipe(ensureNoLeadingSlash, concat$1(ensureTrailingSlash(location.origin)))],
    [always, pipe(ensureNoLeadingSlash, concat$1(ensureTrailingSlash(location.href)))]
]);
const createEnsureAbsolutePath = (location) => pipe(defaultToEmptyString, ensureAbsolutePath(location));

const isRelative = (path) => !isAbsolute(path);

const normalizePath = (path = '', resource, options) => {
    if (resource && options && isRelative(path)) {
        if (resource.base) {
            const resolveBase = resolveBaseWith$1(options.baseMap);
            const ensureAbsolutePath = createEnsureAbsolutePath(window.location);
            return ensureAbsolutePath(ensureTrailingSlash(resolveBase(resource.base)) + path);
        }
        else if (options.base) {
            const ensureAbsolutePath = createEnsureAbsolutePath(window.location);
            if (isRootPath(path)) {
                return ensureAbsolutePath(path);
            }
            return ensureAbsolutePath(ensureTrailingSlash(options.base) + path);
        }
    }
    return path;
};

const toResources = (options, definition) => {
    if (!definition) {
        return [];
    }
    const pathResources = definition.paths.map((path) => ({
        path: normalizePath(path, definition, options),
        dependencyPaths: (definition.dependsOn ? definition.dependsOn : []).map(p => normalizePath(p, definition, options)),
        elements: [definition.element]
    }));
    const dependencyResources = (definition.dependsOn ? definition.dependsOn : []).map((path) => ({
        path: normalizePath(path, definition, options),
        dependencyPaths: [],
        elements: [definition.element]
    }));
    return [
        ...pathResources,
        ...dependencyResources
    ];
};
var toResources$1 = curry(toResources);

const getResourcesFromContainer = (options, container) => {
    const componentDefinitions = getContentDefinitionsFromDOM(container);
    return mergeResources(unnest(componentDefinitions.map(toResources$1(options))));
};
var getResourcesFromContainer$1 = curry(getResourcesFromContainer);

const loadResource = (resource) => {
    return fetch(resource.path).then((response) => {
        const e = new CustomEvent(EVENTS.RESOURCE_LOADED, {
            detail: {
                resource,
                response
            }
        });
        document.dispatchEvent(e);
    });
};
const loadResources = (resources) => resources.map(loadResource);

const getResourceByPath = (resources, path) => resources.find(r => r.path === path);

// ⚠️ TODO: does not check circular dependencies!!!
const checkIfResolvable = (resources = []) => {
    return resources.every(resource => resource.dependencyPaths.every(path => !!getResourceByPath(resources, path)));
};

const getReadyResources = (resourcesToCheck = [], loadedResources = []) => {
    return resourcesToCheck.filter(resource => resource.dependencyPaths.every(path => loadedResources.some(res => res.path === path)));
};

const isCss = (options) => options.resource.path.indexOf('.css') > -1;
const onCssLoaded = (options) => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = options.resource.path;
    document.body.append(style);
};
const cssHandler = {
    match: isCss,
    handle: onCssLoaded
};

const isJs = (options) => options.resource.path.indexOf('.js') > -1;
const onJsLoaded = (options) => {
    const script = document.createElement('script');
    script.src = options.resource.path;
    script.async = true;
    document.body.append(script);
};
const jsHandler = {
    match: isJs,
    handle: onJsLoaded
};

const isEmpty = (test) => test.length === 0;

function _Set() {
    /* globals Set */
    this._nativeSet = typeof Set === 'function' ? new Set() : null;
    this._items = {};
}
// until we figure out why jsdoc chokes on this
// @param item The item to add to the Set
// @returns {boolean} true if the item did not exist prior, otherwise false
//
_Set.prototype.add = function (item) {
    return !hasOrAdd(item, true, this);
};
//
// @param item The item to check for existence in the Set
// @returns {boolean} true if the item exists in the Set, otherwise false
//
_Set.prototype.has = function (item) {
    return hasOrAdd(item, false, this);
};
//
// Combines the logic for checking whether an item is a member of the set and
// for adding a new item to the set.
//
// @param item       The item to check or add to the Set instance.
// @param shouldAdd  If true, the item will be added to the set if it doesn't
//                   already exist.
// @param set        The set instance to check or add to.
// @return {boolean} true if the item already existed, otherwise false.
//
function hasOrAdd(item, shouldAdd, set) {
    var type = typeof item;
    switch (type) {
        case 'undefined':
            if (set._items[type]) {
                return true;
            }
            else {
                if (shouldAdd) {
                    set._items[type] = true;
                }
                return false;
            }
        case 'object':
            if (item === null) {
                if (!set._items['null']) {
                    if (shouldAdd) {
                        set._items['null'] = true;
                    }
                    return false;
                }
                return true;
            }
        /* falls through */
        default:
            // reduce the search size of heterogeneous sets by creating buckets
            // for each type.
            type = Object.prototype.toString.call(item);
            if (!(type in set._items)) {
                if (shouldAdd) {
                    set._items[type] = [item];
                }
                return false;
            }
            // scan through all previously applied items
            if (set._items[type].indexOf(item) === -1) {
                if (shouldAdd) {
                    set._items[type].push(item);
                }
                return false;
            }
            return true;
    }
}

const difference = (first, second) => {
    const out = [];
    let idx = 0;
    const firstLen = first.length;
    const secondLen = second.length;
    const toFilterOut = new _Set();
    for (let i = 0; i < secondLen; i++) {
        toFilterOut.add(second[i]);
    }
    while (idx < firstLen) {
        if (toFilterOut.add(first[idx])) {
            out[out.length] = first[idx];
        }
        idx += 1;
    }
    return out;
};
var difference$1 = curry(difference);

const remove = (start, deleteCount, arr) => [...arr].splice(start, deleteCount);
var remove$1 = curry(remove);

class ResourceLoader {
    constructor(options) {
        this.options = null;
        this.pendingResources = [];
        this.loadedResources = [];
        this.defaultOptions = {
            readyEvent: 'resourcesReady',
            handler: [
                cssHandler,
                jsHandler
            ]
        };
        this.options = Object.assign({ container: this.defaultContainer }, this.defaultOptions, options);
        this.bindEvents();
        this.init(this.options);
    }
    get defaultContainer() {
        return document.querySelector('body');
    }
    init(options) {
        this.waitingResources = [
            ...getResourcesFromContainer$1(options, options.container)
        ];
        checkIfResolvable(this.waitingResources);
        this.pendingResources = [
            ...this.pendingResources,
            ...getReadyResources(this.waitingResources, this.loadedResources)
        ];
        this.waitingResources = difference$1(this.waitingResources, this.pendingResources);
        loadResources(this.pendingResources);
    }
    getStatus() {
        return {
            waiting: this.waitingResources,
            pending: this.pendingResources,
            loaded: this.loadedResources
        };
    }
    bindEvents() {
        document.addEventListener(EVENTS.RESOURCE_LOADED, this.onResourceLoaded.bind(this));
        document.addEventListener(this.options.readyEvent, this.onReady.bind(this));
    }
    onResourceLoaded(event) {
        const resource = event.detail.resource;
        const handler = this.options.handler.map((handler) => [handler.match, handler.handle]);
        cond$1(handler)(event.detail);
        this.loadedResources.push(resource);
        const readyForLoad = getReadyResources(this.waitingResources, this.loadedResources);
        this.pendingResources = [
            ...remove$1(this.pendingResources.indexOf(resource), 1, this.pendingResources),
            ...readyForLoad
        ];
        this.waitingResources = difference$1(this.waitingResources, this.pendingResources);
        loadResources(readyForLoad);
        if (isEmpty(this.waitingResources) && isEmpty(this.pendingResources)) {
            const event = new CustomEvent(this.options.readyEvent);
            document.dispatchEvent(event);
        }
    }
    onReady() {
    }
    update(container) {
        this.init(Object.assign({}, this.options, { container }));
    }
}

export default ResourceLoader;
export { ResourceLoader };
