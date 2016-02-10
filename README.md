# conditional-resource-loader

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
