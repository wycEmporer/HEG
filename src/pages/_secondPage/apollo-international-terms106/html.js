const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout-only-header');
const dirsConfig = config.DIRS;
let pageTitle = '{{##APOLLO-INTERNATIONAL-TERMS106_TITLE_VALUE##}}';
let metaDescription = '{{##APOLLO-INTERNATIONAL-TERMS106_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##APOLLO-INTERNATIONAL-TERMS106_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaDescription, metaKeywords
}).run(content(dirsConfig));
