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
            } else {
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

export default _Set;
