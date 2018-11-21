const chai = require('chai');
const sinonChai = require('sinon-chai');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

chai.use(sinonChai);

const dom = new JSDOM();

global.document = dom.window.document;
