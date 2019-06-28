import ensureNoHtmlFile from "./ensureNoHtmlFile";

describe('#ensureNoHtmlFile', () => {
    test('ignores trailing hash in path', () => {
        const noHtml = ensureNoHtmlFile('http://www.origin.com/sub/path/file.html#');
        expect(noHtml).toBe('http://www.origin.com/sub/path');
    });
    test('ignores html', () => {
        const noHtml = ensureNoHtmlFile('http://www.origin.com/sub/path/file.html');
        expect(noHtml).toBe('http://www.origin.com/sub/path');
    });
})
