const config = require('configModule');
const content = require('./content.ejs');
const dirsConfig = config.DIRS;
const layout = require('layout-only-head');
const scriptStr = '<script async src="https://www.cashfree.com/assets/cashfree.sdk.v1.1.js" type="text/javascript"></script>';
let metaKeywords = '{{##PAYNEW_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##PAYNEW_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle: '{{##PAYNEW_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
  scriptStr
}).run(content(dirsConfig));