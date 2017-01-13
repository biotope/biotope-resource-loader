/**
 * VI Resource Loader v1.2.0
 * For documentation see:
 * https://github.com/virtualidentityag/conditional-resource-loader
 */

function resourceLoader(options) {
	'use strict';

	var $ = jQuery;
	var _loader = {
		conditionsAllArray: []
	};

	var _queue = [];
	var _loadedQueue = [];

	var _cache = {};

	var _debug = options.debug;

	// creates absolute path from any given string
	var absolutePath = function(urlString) {
		var normalizedUrl;
		var absoluteReg = new RegExp('^(?:[a-z]+:)?//', 'i');

		if (absoluteReg.test(urlString)) {
			// is absolute
			normalizedUrl = urlString;
		} else {
			if (urlString.indexOf('/') === 0 && urlString.indexOf('//') !== 0) {
				normalizedUrl = window.location.origin + urlString;
			} else {
				var paths = window.location.pathname.split('/');
				paths.pop();
				normalizedUrl = window.location.origin + paths.join('/') + '/' + urlString;
			}
		}

		return normalizedUrl;
	};

	/**
	 * normalizes the incoming path (relative or absolute) to an absolute url

	 * @param {string} path
	 * @param {object} resource
	 * @returns {string} normalizedPath
	 */
	var normalizePath = function (path, resource) {
		var normalizedPath;
		var pathIsRelative = path.indexOf('http://') === -1 &&
			path.indexOf('https://') === -1 &&
			path.charAt(0) !== '/';

		//resolve relative paths
		if (pathIsRelative) {
			if (resource.base) {
				if (resource.base.substring(0, 2) === '##') {
					resource.base = options.baseMap[resource.base];
				}
				path = resource.base + path;
			} else if (options && options.base) {
				path = options.base + path;
			}
		}
		// create unique absolute path
		normalizedPath = absolutePath(path);

		(_debug) ? console.log('inputPath: ' + path) : '';
		(_debug) ? console.log('normalizedPath: ' + normalizedPath) : '';
		(_debug) ? console.log('------') : '';

		return normalizedPath;
	};

	/**
	 * gets all needed resources on one page and adds them to the download queue
	 */
	var getResources = function () {
		$.each(_loader.conditionsAllArray, function () {
			$.each(this.resources, function () {
				var resource = this;
				var test = resource.test ? resource.test() : true;

				if (test) {
					$.each(resource.paths, function () {
						addPathToQueue(this, resource);
					});
				}
			});
		});
	};

	var addPathToQueue = function(path, resource) {
		var queueObject = {};

		path = normalizePath(path, resource);

		// determine file type
		if (path.indexOf('.css') > -1) {
			queueObject['type'] = 'css';
		} else {
			queueObject['type'] = 'js';
		}
		queueObject['uniquePath'] = path;

		// check depending on files
		if (resource.dependsOn) {
			queueObject['dependingOnFiles'] = [];

			$.each(resource.dependsOn, function () {
				var dependsOnPath = normalizePath(this, resource);
				queueObject['dependingOnFiles'].push(dependsOnPath);
			});
		}

		// add object to queue
		_queue.push(queueObject);
	};

	/**
	 * Validates all files and dependencies in the queue and checks if there are any errors
	 */
	var validateQueue = function () {
		var _tempQueue = $.extend(true, [], _queue);
		var tempLength = _tempQueue.length;

		for (var iterator = 0; iterator < tempLength; iterator++) {
			_tempQueue.forEach(function (qO, index) {
				if (!qO['dependingOnFiles'] || qO['dependingOnFiles'].length === 0) {
					_loadedQueue.push(qO['uniquePath']);
					_tempQueue.splice(index, 1);
				}
			});

			_tempQueue.forEach(function (qO, index) {
				if (_loadedQueue.indexOf(qO['uniquePath']) !== -1) {
					_tempQueue.splice(index, 1);
				}
			});

			_tempQueue.forEach(function (qO, index) {
				if (qO['dependingOnFiles']) {
					qO['dependingOnFiles'].forEach(function (dependency, innerIndex) {
						if (_loadedQueue.indexOf(dependency) !== -1) {
							qO['dependingOnFiles'].splice(innerIndex, 1)
						}
					});
				}
			});
		}

		// check if any unresolvable dependencies are set
		if (_tempQueue.length > 0) {
			_tempQueue.forEach(function (qO) {
				console.warn('Error: Unresolved dependency for ' + qO['uniquePath'] + ' detected. Dependencies: ' + qO['dependingOnFiles']);
			});
		}
	};

	/**
	 * load all the resources in queue
	 */
	var loadResources = function () {
		// if queue is empty, trigger ready
		var checkIfComplete = function () {
			(_debug) ? console.log('Remaining queue: ', _queue) : '';
			if (_queue.length === 0) {
				$(window).trigger('resourcesReady');
			}
		};

		if (_queue.length === 0) {
			$(window).trigger('resourcesReady');
			return;
		}

		// create promise for each unique queue object (path as unique id)
		_queue.forEach(function (outerQueueObject, index) {
			outerQueueObject['promise'] = $.Deferred();
			(_debug) ? outerQueueObject['promiseName'] = 'promise' + index : '';

			_queue.forEach(function (innerQueueObject) {
				if (innerQueueObject['uniquePath'] === outerQueueObject['uniquePath']) {
					innerQueueObject['promise'] = outerQueueObject['promise'];
					(_debug) ? innerQueueObject['promiseName'] = outerQueueObject['promiseName'] : '';
				}
			})
		});

		// add dependencies
		_queue.forEach(function (queueObject) {
			queueObject['dependencies'] = [];
			if (queueObject['dependingOnFiles']) {
				queueObject['dependingOnFiles'].forEach(function (dependency) {
					_queue.forEach(function (queueObjectInner) {
						if (queueObjectInner['uniquePath'] === dependency) {
							(queueObject['dependencies'].push(queueObjectInner['promise']));
							return;
						}
					});
				});
			}
		});

		// execute dependencies
		_queue.forEach(function (queueObject) {

			$.when.apply($, queueObject['dependencies']).done(function () {
				var cachePromise;

				if (_cache[queueObject['uniquePath']]) {
					queueObject['promise'].resolve();
					(_debug) ? console.log('Promise for ' + queueObject['uniquePath'] + ' resolved from cache.') : '';
				} else {
					// load js file
					if (queueObject['type'] === 'js') {
						cachePromise = $.ajax({
							url: queueObject['uniquePath'],
							dataType: 'script',
							cache: true
						}).always(function () {
							queueObject['promise'].resolve();
							_queue = _queue.filter(function (item) {
								return item['uniquePath'] !== queueObject['uniquePath'];
							});

							(_debug) ? console.log('Promise for ' + queueObject['uniquePath'] + ' resolved.') : '';
							checkIfComplete();
						}).fail(function () {
							console.warn('Error while loading: ' + queueObject['uniquePath']);
						});
					}
					// load css file
					if (queueObject['type'] === 'css') {
						var $link = $('<link/>', {
							rel: 'stylesheet',
							type: 'text/css',
							href: queueObject['uniquePath']
						}).on('load', function () {
							queueObject['promise'].resolve();
							_queue = _queue.filter(function (item) {
								return item['uniquePath'] !== queueObject['uniquePath'];
							});

							(_debug) ? console.log('Promise for ' + queueObject['uniquePath'] + ' resolved.') : '';
							checkIfComplete();
						}).on('error', function () {
							console.warn('Error while loading: ' + queueObject['uniquePath']);
							queueObject['promise'].resolve();
							_queue = _queue.filter(function (item) {
								return item['uniquePath'] !== queueObject['uniquePath'];
							});

							(_debug) ? console.log('Promise for ' + queueObject['uniquePath'] + ' resolved.') : '';
							checkIfComplete();
						});

						$('head').append($link);
						cachePromise = $.Deferred().resolve();
					}

					_cache[queueObject['uniquePath']] = cachePromise;
				}
			});
		});
	};

	if (options && options.resources) {
		_loader.conditionsAllArray = _loader.conditionsAllArray.concat(options.resources);
	} else {
		$('[data-resources]').each(function () {
			var obj = {};
			obj.resources = eval($(this).attr('data-resources'));
			_loader.conditionsAllArray.push(obj);
		});
	}

	if (_loader.conditionsAllArray.length > 0) {
		getResources();
		validateQueue();
		loadResources();
	} else {
		$(window).trigger('resourcesReady');
	}
}
