# conditional-resource-loader

The resourceLoader function returns a loader object with two public methods (add() and exec()) which can be used to load css and js resources. 

**Usage**
```javascript
$(document).on('ready', function() {
	'use strict';

	var $conditionalComponents = $('[data-resources]');

	if ($conditionalComponents.length) {
		$(window).on('resourcesReady', function() {
      //initiazlie components
      $('[data-init]').each(function() {
        var init = eval($(this).attr('data-init'));
        init();
      });
		});

		loadComponentResources();
	}

	function loadComponentResources() {
		var allResources = [];
		var loader = resourceLoader({
			base: 'optional/base/path'
		});

		$conditionalComponents.each(function() {
			var resources = eval($(this).attr('data-resources'));
			allResources.push({resources});
		});

		loader.add(allResources);
		loader.exec();
	}
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
data-init="(function() { $('.component').component(); })"
```    
