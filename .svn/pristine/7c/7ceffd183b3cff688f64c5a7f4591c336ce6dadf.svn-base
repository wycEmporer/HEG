const config = require('configModule');
const noJquery = require('withoutJqueryModule');
const content = require('./content.ejs');
const layout = require('layout-only-header');
const scriptStr = '<script async src="https://www.cashfree.com/assets/cashfree.sdk.v1.1.js" type="text/javascript"></script>';
const dirsConfig = config.DIRS;

let metaKeywords = '{{##BOOKING_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##BOOKING_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle: '{{##BOOKING_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
  scriptStr
}).run(content(dirsConfig));
