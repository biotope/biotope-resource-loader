---
id: api
title: API
sidebar_label: API guide
---

## ResourceLoaderOptions

| Property                         | Type                  | Optional | Default            | Description                                                                 |
|----------------------------------|-----------------------|----------|--------------------|-----------------------------------------------------------------------------|
| `container`                      | HTMLElement           | yes      | body               | The container in which to search for resource components                                           |
| `resourceListAtrributeSelector`  | string                | yes      | `data-resources`   | The attribute to search in container for the resources                                             |
| `initScripts`                    | boolean               | yes      | true               | If true, registered plugins will be initialized after loaded                                       |
| `initScriptAttributeSelector`    | string                | yes      | `data-init`        | The attribute with the plugin name to search for when initializing plugins                         |
| `scriptOptionsAttributeSelector` | string                | yes      | `data-options`     | The attribute with JSON options to search for when initializing plugins                            |
| `readyEvent`                     | string                | yes      | `'resourcesReady'` | [The name for the event that's fired once a resource is appended to the document](#resourcesReady) |
| `scriptParsedEvent`              | string                | yes      | `'scriptParsed'`   | [The name for the event that's fired once an attached script is parsed](#scriptParsed)             |
| `base`                           | string                | yes      | `''`               | The base path to use for every relative resource                                                   |
| `baseMap`                        | [BaseMap](#basemap)   | yes      | undefined          | The base path map to use for resolving base references                                             |
| `handler`                        | [Handler](#handler)[] | yes      | `[]`               | These handlers will be called on resource loaded when they match                                   |

## BaseMap
The baseMap is a key-value connection of a reference and a base path. Lets take the following example:
```html
<div data-resources="[{paths: ['##content/resources/js/main.js']}]"></div>
```
```javascript
const resourceLoader = new ResourceLoader({
    baseMap: {
        '##content': '/root/path'
    }
});
```

This will result in the loading of the resource: `/root/path/resources/js/main.js`

## Handler
| Property | Type                                                    | Optional | Default   | Description                                                                    |
|----------|---------------------------------------------------------|----------|-----------|--------------------------------------------------------------------------------|
| `match`  | (options: [HandlerOptions](#handleroptions)) => boolean | no       | undefined | This function will be called and if it returns true, the handle will be called |
| `handle` | (options: [HandlerOptions](#handleroptions)) => void    | no       | undefined | This function will be called if the match parameter returns true               |

## HandlerOptions
| Property            | Type                  | Optional | Description                 |
|---------------------|-----------------------|----------|------------------|
| `resource`          | [Resource](#resource) |no        | The loaded resource details |
| `response`          | Response              |no        | The server response         |
| `scriptParsedEvent` | string                |yes       | Custom event name for event that's triggered when script is parsed. |

## Resource
| Property          | Type          | Description                               |
|-------------------|---------------|-------------------------------------------|
| `path`            | string        | The url of this resource                  |
| `dependencyPaths` | string[]      | The dependencies of this resource         |
| `elements`        | HTMLElement[] | The elements the resource originates from |


## ResourceDefinition
The resource definitions are the value of the `data-resources` attribute

| Property    | Type     | Optional | Default | Description                                       |
|-------------|----------|----------|---------|---------------------------------------------------|
| `paths`     | string[] |          |         | Theses resources will be loaded                   |
| `dependsOn` | string[] | yes      | `[]`    | These are the resources the `paths` depend on     |
| `base`      | string   | yes      | `''`    | This is the base for all relative resource paths  |

### Example
```javascript
const definition = {
    paths: [
        'foo/bar.js',
        'bar/foo.css'
    ],
    dependsOn: [
        'dependency/important.js'
    ],
    base: '/public/resources'
}
```

## Available events
There are 2 main event's available, to provide control on what happens with loaded resources.
Both of them can be renamed to your fit your needs, while retaining the same functionality.

For simplicity's sake, we'll use their default names in this documentation.

### `resourcesReady`
This `CustomEvent` is triggered whenever a resource has been attached to the DOM. (style, html, js)

The event will be triggered from any `HtmlElement` which has the newly added resource as a dependency.
This means you can use `event.target` to access said elements once the resource is in the DOM.

> **`resourcesReady` does not mean resource parsed!**<br><br>
If your operation requires the file's content to be parsed, use the [`scriptParsed`](#scriptParsed) event instead.<br><br>
Am example of an **unsafe** operation to perform using this event is calling a Plugin's constructor function.


### `scriptParsed`
This `CustomEvent` is triggered whenever the browser has finished parsing a script resource.
You may use `event.target` to access the elements that triggered a load of said script.

This event is only fired by resources that match the `javascript` [handler](#handler).
This means it:
1. Won't trigger for `CSS` or `HTML` resources;
2. It won't be triggered in case you overwrite any [handlers](#handler);
