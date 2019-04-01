const config = require('configModule');
const noJquery = require('withoutJqueryModule');
const content = require('./content.ejs');
const layout = require('layout-only-header');
const dirsConfig = config.DIRS;
let metaKeywords = '{{##FLIGHT-PRODUCT_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##FLIGHT-PRODUCT_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle: '{{##FLIGHT-PRODUCT_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
}).run(content(dirsConfig));
