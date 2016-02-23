/**
 * VI Resource Loader v0.0.6
 * For documentation see:
 * https://github.com/virtualidentityag/conditional-resource-loader
 */

function resourceLoader(options) {
	'use strict';

	var loader = {
		conditionsAllArray: []
	};
	var styles = [];
	var scripts = [];
	var getResources = function() {
		$.each(loader.conditionsAllArray, function () {
			$.each(this.resources, function() {
				var resource = this;
				var test = this.test ? this.test() : true;

				if (test) {
					$.each(resource.paths, function() {
						var path = this;
						var pathIsRelative = path.indexOf('http://') === -1 &&
							path.indexOf('https://') === -1;

						//resolve relative paths
						if (pathIsRelative) {
							if (resource.base) {
								path = resource.base + path;
							} else if (options && options.base) {
								path = options.base + path;
							}
						}

						if (path.indexOf('.css') > -1) {
							if ($.inArray(path, styles) === -1) {
								styles.push(path);
							}
						} else {
							if ($.inArray(path, scripts) === -1) {
								scripts.push(path);
							}
						}
					});
				}
			});
		});
	};
	var loadResources = function () {
		var jsCounter = 0;
		var cssCounter = 0;
		var links = [];
		var checkIfComplete = function() {
			if (jsCounter === scripts.length && cssCounter === styles.length) {
				$(window).trigger('resourcesReady');
			}
		};

		if (scripts.length === 0 && styles.length === 0) {
			$(window).trigger('resourcesReady');
			return;
		}

		//load styles
		if (styles.length > 0) {
			$.each(styles, function () {
				var url = this;

				var $link = $('<link/>', {
					rel: 'stylesheet',
					type: 'text/css',
					href: url
				}).on('load', function() {
					console.log(url + ' loaded');
					cssCounter++;
					checkIfComplete();
				}).on('error', function() {
					console.warn('Error while loading: ' + url);
					cssCounter++;
					checkIfComplete();
				});

				links.push($link);
			});

			$('head').append(links);
		}

		//load scripts
		if (scripts.length > 0) {
			$.each(scripts, function () {
				var url = this;

				$.ajax({
					url: url,
					dataType: 'script',
					cache: true
				}).done(function() {
					console.log(url + ' loaded');
					jsCounter++;
					checkIfComplete();
				}).fail(function () {
					console.warn('Error while loading: ' + url);
					jsCounter++;
					checkIfComplete();
				});
			});
		}
	};

	if (options && options.resources) {
		loader.conditionsAllArray = loader.conditionsAllArray.concat(options.resources);
	} else {
		$('[data-resources]').each(function() {
			var obj = {};
			obj.resources = eval($(this).attr('data-resources'));
			loader.conditionsAllArray.push(obj);
		});
	}

	if (loader.conditionsAllArray.length > 0) {
		getResources();
		loadResources();
	} else {
		$(window).trigger('resourcesReady');
	}
}
