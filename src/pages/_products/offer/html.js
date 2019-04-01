const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##OFFER_TITLE_VALUE##}}';
let metaDescription = '{{##OFFER_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##OFFER_META_KEYWORDS_VALUE##}}';

module.exports = layout.init({
  pageTitle,
  metaKeywords,
  metaDescription,
}).run(content(dirsConfig));
