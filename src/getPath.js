function getOrigin() {
  if (!window.location.origin) {
    return (window.location.origin =
			window.location.protocol +
			'//' +
			window.location.hostname +
			(window.location.port ? ':' + window.location.port : ''));
  }
  return window.location.origin;
}

function absolutePath(urlString) {
  let normalizedUrl;
  const absoluteReg = new RegExp('^(?:[a-z]+:)?//', 'i');

  if (absoluteReg.test(urlString)) {
    // is absolute
    normalizedUrl = urlString;
  } else {
    if (urlString.indexOf('/') === 0 && urlString.indexOf('//') !== 0) {
      normalizedUrl = getOrigin() + urlString;
    } else {
      const paths = window.location.pathname.split('/');
      paths.pop();
      normalizedUrl = getOrigin() + paths.join('/') + '/' + urlString;
    }
  }
  return normalizedUrl;
}

function getPath(path, resource, options) {
  const pathIsRelative =
		path.indexOf('http://') === -1 &&
		path.indexOf('https://') === -1 &&
		path.charAt(0) !== '/';

  // resolve relative paths
  if (pathIsRelative) {
    if (resource.base) {
      if (resource.base.substring(0, 2) === '##')
        resource.base = options.baseMap[resource.base];

      path = resource.base + path;
    } else if (options && options.base) {
      path = options.base + path;
    }
  }
  // create unique absolute path
  const normalizedPath = absolutePath(path);

  if (false) {
    console.log('inputPath: ' + path);
    console.log('normalizedPath: ' + normalizedPath);
    console.log('------');
  }

  return normalizedPath;
}

export default getPath;
