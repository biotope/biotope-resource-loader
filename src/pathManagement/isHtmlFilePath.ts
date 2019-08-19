const isHtmlFilePath = (path: string): boolean =>
	/^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?([a-zA-Z0-9\-\.\?\!\,\'\/\\\+&amp;%\$#_]*)?$/gm.test(
		path
	);

export default isHtmlFilePath;
