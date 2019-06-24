const isHtmlFilePath = (path: string): boolean => (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+.html[\/#]?.?$/gm).test(path);

export default isHtmlFilePath;
