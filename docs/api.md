# API

## ResourceLoaderOptions

| Property                         | Type                  | Optional | Default            | Description                                                                 |
|----------------------------------|-----------------------|----------|--------------------|-----------------------------------------------------------------------------|
| `container`                      | HTMLElement           | yes      | body               | The container in which to search for resource components                    |
| `resourceListAtrributeSelector`  | string                | yes      | `data-resources`   | The attribute to search in container for the resources                      |
| `initPlugins`                    | boolean               | yes      | true               | If true, registered plugins will be initialized after loaded                |
| `initPluginAttributeSelector`    | string                | yes      | `data-init`        | The attribute with the plugin name to search for when initializing plugins  |
| `pluginOptionsAttributeSelector` | string                | yes      | `data-options`     | The attribute with JSON options to search for when initializing plugins     |
| `readyEvent`                     | string                | yes      | `'resourcesReady'` | The even which will be fired once all the resources are successfully loaded |
| `base`                           | string                | yes      | `''`               | The base path to use for every relative resource                            |
| `baseMap`                        | [BaseMap](#basemap)   | yes      | undefined          | The base path map to use for resolving base references                      |
| `handler`                        | [Handler](#handler)[] | yes      | `[]`               | These handlers will be called on resource loaded when they match            |

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
| Property   | Type                  | Description                 |
|------------|-----------------------|-----------------------------|
| `resource` | [Resource](#resource) | The loaded resource details |
| `response` | Response              | The server response         |  


## Resource
| Property          | Type          | Description                              |
|-------------------|---------------|------------------------------------------|
| `path`            | string        | The url of this resource                 |
| `dependencyPaths` | string[]      | The dependencies of this resource        |
| `elements`        | HTMLElement[] | The elemets the resource originates from |


## ResourceDefinition
The resource definitions are the value of the `data-resources` attribute

| Property    | Type     | Optional | Default | Description                                       |
|-------------|----------|----------|---------|---------------------------------------------------|
| `paths`     | string[] |          |         | Theses resources will be loaded                   |
| `dependsOn` | string[] | yes      | `[]`    | These are the resources the `paths` depend on     |
| `base`      | string   | yes      | `''`    | This is the base for all reslative resource paths |

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
