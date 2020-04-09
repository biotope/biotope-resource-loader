---
id: initialize
title: Initializing plugins
sidebar_label: Initializing plugins
---

By default, the resource-loader will try to initialize loaded resources.
To set which plugin to initialize you'll need to register the component with a name and pass that same name via attributes in your html code.
Please check below for more info on the necessary steps:

1. Register the component, using the `registerScript` helper from the Resource Loader module:

```javascript
import { registerScript } from '@biotope/resource-loader';

class MyPlugin {
    constructor(element, options) {
      // element = the HTML Element you set the data-init attribute on
      // options = any JSON parsable content you set on data-options attribute
      …
    }
}

registerScript(
  // your plugin's class
  MyPlugin,
  // the name you want to set your plugin to be used via the data-init attribute
  'MyPlugin'
);
```

2. Set the name of the plugin to initialize on your HTML via the `data-init` attribute.

```html
<div
  data-resources="['resources/js/MyPlugin.js']"
  data-init="MyPlugin"
>
</div>
```

3. Should you need to pass any options to your plugin, you can do so using the data-options attribute. Please keep in mind, the value must be parsable by the `JSON.parse()` method.

```html
<div
  data-resources="['resources/js/MyPlugin.js']"
  data-init="MyPlugin"
  data-options='{
    option1: "Anything is valid on the options"
    option2: "As long as it is parsable by JSON.parse()"
  }'
>
</div>
```

## Plugin initialization via JQuery or `eval`
Starting on `Version 3`, the resource loader drops support for `eval` or `JQuery` to initialize plugins.
If you need that behaviour, you'll have to add it inside your project's scope.

Should the default plugin initializion clash with your project's requirements, you can disable it via the `initScripts` option:

```javascript
const resourceLoader = new ResourceLoader({
    initScripts: false
});
```