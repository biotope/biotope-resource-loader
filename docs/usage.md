---
id: usage
title: Usage
sidebar_label: Usage
---

## Create
To init a resource-loader just create a new instance of the resource loader class:
```javascript
const resourceLoader = new ResourceLoader();
```

This will search your whole body for resource components and load all the resources defined on them.

## Resource Components
By default, the resource-loader will acknowledge any HTML tag containing a `data-resources` attribute:
```html
<div 
  data-resources="[{
    paths: ['/script.js', '/style.css', '/template.html']
  }]"
>
</div>
```

Alternatively, you also configure the resource-loader to match another attribute.

We encourage the use of HTML data attributes, as they are specification compliant.
However, you are free to pick any attribute to your liking:

```javascript
const resourceLoader = new ResourceLoader({
    resourceListAtrributeSelector: "data-anything-really"
});
```

```html
<div data-anything="[]"></div>
```

To know what data should go inside the resources attribute, have a look at the [API documentation](api.md)
