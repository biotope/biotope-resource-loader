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
		base: 'optional_base_path',
		resources: optionalArrayOfResources
	});
});
```

**Syntax for data-resources attribute:**
```javascript
[
  {
      paths: ['js/jquery.component.js']
  },
  {
      paths: ['js/jquery.component.js', 'css/component.css'],
      base: 'resources-content'          
  },
  {
      paths: ['js/jquery.component.js', 'css/component.css'],
      base: 'resources-content',   
      test: (function() { return true; })
  }
]
```

**Syntax for data-init attribute:**
```javascript
data-init="(function($elm) { $elm.component(); })"
```    
