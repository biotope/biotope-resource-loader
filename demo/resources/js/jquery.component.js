/**
 * @name          jQuery Boilerplate
 * @version       1.0
 * @lastmodified  2015-04-24
 * @package       html-css-js
 * @subpackage    jQuery plugin
 * @author        JR, VI
 *
 * based on: http://jqueryboilerplate.com/
 */

(function($, window, document, undefined) {
  'use strict';

  let pluginName = 'component',
    defaults = {
      foo: 'bar'
    };
  // The actual plugin constructor
  function Plugin(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this.init();
  }

  // methods
  const methods = {
    init: function() {
      // your init is goes here
      this.myFunction();
    },

    myFunction: function() {
      console.log('initializing component');
    }
  };

  // build
  $.extend(Plugin.prototype, methods);

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));

        /**
				 * DEV-note: Use trigger failsafe events if other plugins depend on this plugins ready state
				 */
        // trigger ready event on element - optional
        // $.triggerFailsafeEvent($(this), 'plugin_' + pluginName + '.ready');
      }
    });

    // trigger ready event globally - optional
    // if(this.length > 0) {
    //    $.triggerFailsafeEvent($(window), 'plugin_' + pluginName + '.ready_all');
    // }

    return this;
  };
})(jQuery, window, document);
