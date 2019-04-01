const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout-only-header');
const dirsConfig = config.DIRS;
let pageTitle = '{{##APOLLO-DOMESTIC-TERMS_TITLE_VALUE##}}';
let metaDescription = '{{##APOLLO-DOMESTIC-TERMS_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##APOLLO-DOMESTIC-TERMS_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaDescription, metaKeywords
}).run(content(dirsConfig));
