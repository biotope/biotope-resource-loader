---
id: initialize
title: Initializing plugins
sidebar_label: Initializing plugins
---

## Default Plugin initialization via the registerScript helper.
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

## Legacy plugin initialization via JQuery or `eval`
Starting on `Version 3`, the resource loader drops support for `eval` or `JQuery` to initialize plugins.
Should you require this behaviour, you'll have to manually initialize your plugins. 
This can be accomplished by hooking on the `scriptParsed` [event](api.md#ResourceLoaderOptions), which is fired everytime a script has finished loading and parsing.

Below you can find the necessary steps to accomplish just that:

1. Make sure that the default plugin initializion is disabled, as it clashes with your project's requirements.
You can disable it via the `initScripts` option

```javascript
const resourceLoader = new ResourceLoader({
    initScripts: false,
});
```

2. If your scripts are self-initializing, you're done. If they register a contructor class, proceed with step 3.

3. Add a listener to the `document`, which triggers your custom initialization logic:

```javascript
window.addEventListener('scriptParsed', (event) => {
  const { target } = event;
  const myInitializationFunction = eval((target as HTMLElement).getAttribute('data-init'));
  /**
   * if you're attaching your plugin's constructor to Jquery, use: 
   * myInitializationFunction($(target));
  **/
  myInitializationFunction(target);
})
```

4. Remove from your project any script initialization logic that might be triggered by the `resourcesReady`event.
`resourcesReady` only means that the resource has been appended to the DOM, not that it has finished loading/parsing!
