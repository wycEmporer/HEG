const config = require('configModule');
const content = require('./content.ejs');
const dirsConfig = config.DIRS;
const layout = require('layout');
const scriptStr = '<script async src="https://www.cashfree.com/assets/cashfree.sdk.v1.1.js" type="text/javascript"></script>';
let metaKeywords = '{{##ACCOUNT_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##ACCOUNT_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle: '{{##ACCOUNT_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
  scriptStr
}).run(content(dirsConfig));