# Usage

## Create
To init a resource-loader just create a new instance of the resource loader class:
```javascript
const resourceLoader = new ResourceLoader();
```

This will search your whole body for resource components and load all the resources defined on them.

## Resource Components
By default, the resource-loader will acknowledge any html tag containing a `data-resources` attribute:
```html
<div data-resources="[]"></div>
```

Alternatively, you also configure the resource-loader to match againt another attribute.
We recommend using HTML data-attributes, as they are spec compliant, but you are free to pick any attribute:

```javascript
const resourceLoader = new ResourceLoader({
    resourceListAtrributeSelector: "data-anything"
});
```

```html
<div data-anything="[]"></div>
```

To know what data should go in there look at the [API documentation](./api.md)
