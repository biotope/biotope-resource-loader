import isHtmlFilePath from "./isHtmlFilePath";

describe('#isHtmlFilePath', () => {
    test('returns true for hash in path', () => {
        const isHtml = isHtmlFilePath('http://www.origin.com/sub/path/file.html#');
        expect(isHtml).toBe(true);
    });
    test('returns true html in path', () => {
        const isHtml = isHtmlFilePath('http://www.origin.com/sub/path/file.html');
        expect(isHtml).toBe(true);
    });
})
