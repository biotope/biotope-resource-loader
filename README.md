# conditional-resource-loader

The resourceLoader loads styles and scripts for components via ajax or link tag injection. Resources that should be loaded can either be provided via "resources" option during initialization of loader or when not, they will be fetched from data-resources attribute in DOM by loader itself.

**Usage**
```javascript
$(document).on('ready', function() {
	$(window).on('resourcesReady', function() {
		//initiazlie components
		$('[data-init]').each(function() {
			var init = eval($(this).attr('data-init'));
			init($(this));
		});
	});

	resourceLoader({
		base: 'optional_base_path/',
		resources: optionalArrayOfResources
	});
});
```
---
**Syntax for data-resources attribute:**
```javascript
[
  {
      paths: ['js/jquery.component.js']
  },
  {
      paths: ['js/jquery.component2.js', 'css/component.css'],
      dependsOn: [js/jquery.component.js]
      base: 'resources-content/'          
  },
  {
      paths: ['js/jquery.component.js', 'js/jquery.component3.js', 'css/component.css'],
      dependsOn: [js/jquery.component2.js]
      base: 'resources-content/',
      test: (function() { return true; })
  }
]
```

**Syntax for data-init attribute:**
```javascript
data-init="(function($elm) { $elm.component(); })"
```    
---
**baseMap**

The baseMap option is useful in cases when base path for a resource in data attribute can not point directly to a path due to CMS constraints. In such cases we set the base path to a key (a key must always start with ##) and define the value of that key via baseMap option when initilizing resourceLoader. For example if we can't set 'base' to 'resources-content' directly, we can instead do this:

*HTML*
```
data-resources="[{paths: ['css/component.css'], base: '##content'}]"
```

*JavaScript*
```
resourceLoader({
	base: 'resources',
	baseMap: {
		'##content': 'resources-content/'
	}
});
```
