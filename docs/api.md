---
id: api
title: API
sidebar_label: API guide
---

## ResourceLoaderOptions

| Property                         | Type                  | Optional | Default                | Description                                                                |
|----------------------------------|-----------------------|----------|------------------------|--------------------------------------------------------------------------- |
| `container`                      | HTMLElement           | yes      | body                   | The container in which to search for resource components                   |
| `resourceListAtrributeSelector`  | string                | yes      | `data-resources`       | The attribute to search in container for the resources                     |
| `initScripts`                    | boolean               | yes      | true                   | If true, registered plugins will be initialized after loaded               |
| `initScriptAttributeSelector`    | string                | yes      | `data-init`            | The attribute with the plugin name to search for when initializing plugins |
| `scriptOptionsAttributeSelector` | string                | yes      | `data-options`         | The attribute with JSON options to search for when initializing plugins    |
| `scriptReadyEventName`           | string                | yes      | `'scriptReady'`        | [Rename scriptReady event](#scriptready)                                   |
| `styleReadyEventName`            | string                | yes      | `'styleReady'`         | [Rename styleReady event](#styleready)                                     |
| `htmlReadyEventName`             | string                | yes      | `'htmlReady'`          | [Rename htmlReady event](#htmlready)                                       |
| `resourceQueueEmptyEventName`    | string                | yes      | `'resourceQueueEmpty'` | [Rename resourceQueueEmpty event](#resourcequeueempty)                     |
| `base`                           | string                | yes      | `''`                   | The base path to use for every relative resource                           |
| `baseMap`                        | [BaseMap](#basemap)   | yes      | undefined              | The base path map to use for resolving base references                     |
| `handler`                        | [Handler](#handler)[] | yes      | `[]`                   | These handlers will be called on resource loaded when they match           |

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
| Property               | Type                  | Optional | Description                                                                |
|------------------------|-----------------------|----------|----------------------------------------------------------------------------|
| `resource`             | [Resource](#resource) |no        | The loaded resource details                                                |
| `response`             | Response              |no        | The server response                                                        |
| `scriptReadyEventName` | string                | yes      | Custom event name for event that's triggered when a script is parsed.      |
| `styleReadyEventName`  | string                | yes      | Custom event name for event that's triggered when a stylesheet is applied. |
| `htmlReadyEventName`   | string                | yes      | Custom event name for event that's triggered when html is appended.        |

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
To communicate to your app, the resource loader will fire events based on the state of resources.
These events can be renamed to your fit your needs, while retaining the same logic.

For simplicity's sake, we'll use their default names in this documentation.

### `scriptReady`
This `CustomEvent` is triggered whenever the browser has finished parsing a script resource.
You may use `event.target` to access the elements that triggered a load of said script.

This event is only fired by script resources.<br>
Please note that it won't be fired if you overwrite the [handlers](#handler).

### `styleReady`
This `CustomEvent` is triggered whenever the browser has finished parsing a stylesheet.
You may use `event.target` to access the elements that triggered a load of said stylesheet.

This event is only fired by style resources.<br>
Please note that it won't be fired if you overwrite the [handlers](#handler).

### `htmlReady`
This `CustomEvent` is triggered whenever the browser has appended to the `document`.
You may use `event.target` to access the elements that triggered the append.

This event is only fired by markup resources.<br>
Please note that it won't be fired if you overwrite the [handlers](#handler).

### `resourceQueueEmpty`
This `CustomEvent` is triggered when the resource-loader's queue is empty.
This means all resources for a given `HtmlElement` have been matched to a handler.

You can use `event.target` to target the elements which trigggered the loading of resources.

> **You probably won't ever need `resourceQueueEmpty`.**<br><br>
The `resourceQueueEmpty` is made available as a nice to have.<br>
It's meant for edge cases where you might want to know once resources have been matched to a handler.<br><br>
Never use it to initialize scripts, check if styles have been applied or html is in the document.<br>
**It's not meant for that!**
