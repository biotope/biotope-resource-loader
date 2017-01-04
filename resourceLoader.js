/**
 * VI Resource Loader v0.0.9
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
	var _filesToLoad = [];
	var _filesNeeded = [];
	var _cache = {};

  /**
	 * normalizes the incoming path (relative or absolute) to an absolute url

	 * @param {string} path
   * @param {object} resource
   * @returns {string} normalizedPath
   */
  var normalizePath = function(path, resource) {
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

    return normalizedPath;
  };

  /**
	 * gets all needed resources on one page and adds them to the download queue
   */
	var getResources = function() {
    $.each(_loader.conditionsAllArray, function () {
			$.each(this.resources, function() {
				var resource = this;
				var test = this.test ? this.test() : true;

        if (test) {
          $.each(resource.paths, function() {
						var path = normalizePath(this, resource);
						var queueObject = {};

						// determine file type
						if (path.indexOf('.css') > -1) {
              queueObject['type'] = 'css';
            } else {
              queueObject['type'] = 'js';
            }
            queueObject['uniquePath'] = path;
						if ($.inArray(path, _filesToLoad) === -1) {
							_filesToLoad.push(path);
						}

						// check depending on files
						if(resource.dependsOn) {
              queueObject['dependingOnFiles'] = [];

              $.each(resource.dependsOn, function() {
              	var dependsOnPath = normalizePath(this, resource);
                queueObject['dependingOnFiles'].push(dependsOnPath);
                if ($.inArray(dependsOnPath, _filesNeeded) === -1) {
                  _filesNeeded.push(dependsOnPath);
                }
							});
						}

						// add object to queue
						_queue.push(queueObject);
					});
				}
			});
		});
	};

	/**
	 * load all the resources in queue
   */
	var loadResources = function () {
    // filter queue to get each unique path
    var filteredQueue = _queue.filter(function(item, pos) {
      return _queue.indexOf(item) == pos;
    });

    // check if all dependencies are loaded
    _filesNeeded.forEach(function(item) {
    	if (_filesToLoad.indexOf(item) === -1) {
    		console.warn('Error in dependency: ' + item + ' will never be loaded.');
			}
		});

    // if queue is empty, trigger ready
		var checkIfComplete = function() {
			if (_queue.length === 0) {
				$(window).trigger('resourcesReady');
			}
		};

		if (_queue.length === 0) {
			$(window).trigger('resourcesReady');
			return;
		}

		// create promise for each unique queue object (path as unique id)
    filteredQueue.forEach(function(filteredQueueObject, index) {
    	filteredQueueObject['promise'] = $.Deferred();

      _queue.forEach(function(queueObject) {
      	if (queueObject['uniquePath'] === filteredQueueObject['uniquePath']) {
      		queueObject['promise'] = filteredQueueObject['promise'];
				}
			})
    });

		// add dependencies
		_queue.forEach(function(queueObject) {
      queueObject['dependencies'] = [];
			if(queueObject['dependingOnFiles']) {
        queueObject['dependingOnFiles'].forEach(function(dependency) {
          _queue.forEach(function(queueObjectInner) {
        			if(queueObjectInner['uniquePath'] === dependency) {
        				(queueObject['dependencies'].push(queueObjectInner['promise']));
        				return;
							}
					});
				});
			}
		});

		// execute dependencies
		_queue.forEach(function(queueObject) {

			$.when.apply($, queueObject['dependencies']).done(function() {
        var cachePromise;

        if (_cache[queueObject['uniquePath']]) {
          queueObject['promise'].resolve();
        } else {
        	// load js file
					if(queueObject['type'] === 'js') {
							cachePromise = $.ajax({
								url: queueObject['uniquePath'],
								dataType: 'script',
								cache: true
							}).always(function() {
								queueObject['promise'].resolve();
								_queue = _queue.filter(function(item) {
									return item['uniquePath'] !== queueObject['uniquePath'];
								});
								checkIfComplete();

							}).fail(function () {
								console.warn('Error while loading: ' + queueObject['uniquePath']);
							});
						}
          // load css file
						if(queueObject['type'] === 'css') {
              var $link = $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: queueObject['uniquePath']
              }).on('load', function() {
                queueObject['promise'].resolve();
                _queue = _queue.filter(function (item) {
                	return item['uniquePath'] !== queueObject['uniquePath'];
                });
                checkIfComplete();
              }).on('error', function() {
                console.warn('Error while loading: ' + url);
                queueObject['promise'].resolve();
                _queue = _queue.filter(function (item) {
                	return item['uniquePath'] !== queueObject['uniquePath'];
                });
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
		$('[data-resources]').each(function() {
			var obj = {};
			obj.resources = eval($(this).attr('data-resources'));
			_loader.conditionsAllArray.push(obj);
		});
	}

	if (_loader.conditionsAllArray.length > 0) {
		getResources();
		loadResources();
	} else {
		$(window).trigger('resourcesReady');
	}
}

// creates absolute path from any given string
function absolutePath (urlString) {
	var normalizedUrl;
  var absoluteReg = new RegExp('^(?:[a-z]+:)?//', 'i');

	if (absoluteReg.test(urlString)) {
    // is absolute
     normalizedUrl = urlString;
	} else {
    if (urlString.indexOf('/') === 0 && urlString.indexOf('//') !== 0) {
      normalizedUrl = window.location.protocol + '//' + window.location.hostname + urlString;
    } else {
      var paths = window.location.pathname.split('/');
      paths.pop();
      normalizedUrl = window.location.protocol + '//' + window.location.hostname + paths.join('/') + '/' + urlString;
		}
	}

  return normalizedUrl;
}

