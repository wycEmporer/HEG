const config = require('configModule');
const noJquery = require('withoutJqueryModule');
const content = require('./content.ejs');
const headScript = require('./headScript.ejs');
const layout = require('layout-only-header');
const scriptStr = '<script async src="https://www.cashfree.com/assets/cashfree.sdk.v1.1.js" type="text/javascript"></script>';
const dirsConfig = config.DIRS;

let metaKeywords = '{{##PAYMENT-STATE_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##PAYMENT-STATE_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle: '{{##PAYMENT-STATE_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
  scriptStr:headScript()
}).run(content(dirsConfig));