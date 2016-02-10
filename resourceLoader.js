/**
 * VI Resource Loader v0.0.1
 * For documentation see:
 * https://github.com/virtualidentityag/conditional-resource-loader
 */

function resourceLoader(options) {
	'use strict';

	var loader = { conditionsAllArray: [] };
	var styles = [];
	var scripts = [];

	var getResources = function() {
		$.each(loader.conditionsAllArray, function () {
			$.each(this.resources, function() {
				var resource = this;
				var js = [];
				var css = [];

				var test = this.test ? this.test() : true;

				if (test) {
					$.each(resource.paths, function() {
						var path = this;

						//resolve relative paths
						if (path.indexOf('http') === -1) {
							if (resource.base) {
								path = resource.base + path;
							} else {
								path = options.base + path;
							}
						}

						if (path.indexOf('.css') > -1) {
							css.push(path);
						} else {
							js.push(path);
						}
					});

					$.merge(scripts, js);
					$.merge(styles, css);
				}
			});
		});
	};

	var loadResources = function () {
		var counter = 0;

		//load styles
		if (styles.length > 0) {
			$.each(styles, function () {
				$('<link/>', {
					rel: 'stylesheet',
					type: 'text/css',
					href: this
				}).appendTo('head');
			});
		}

		//load scripts
		if (scripts.length === 0) {
			$(window).trigger('resourcesReady');
			return;
		}

		$.each(scripts, function () {
			var url = this;

			$.ajax({
				url: url,
				dataType: 'script',
				cache: true
			}).done(function() {
				counter++;
				checkIfComplete();
			}).fail(function () {
				console.warn('Error while loading: ' + scriptUrl);
				counter++;
				checkIfComplete();
			});
		});

		function checkIfComplete() {
			if (counter === scripts.length) {
				$(window).trigger('resourcesReady');
			}
		}
	};

	//public methods of conditionalloader
	loader.add = function (conditionsArray) {
		this.conditionsAllArray = this.conditionsAllArray.concat(conditionsArray);
	};

	loader.exec = function () {
		if (this.conditionsAllArray.length > 0) {
			getResources();
			loadResources();
		} else {
			$(window).trigger('resourcesReady');
		}
	};

	return loader;
}
