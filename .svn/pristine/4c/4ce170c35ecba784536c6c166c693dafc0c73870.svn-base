const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##DOMESTIC-TERMS_TITLE_VALUE##}}';
let metaDescription = '{{##DOMESTIC-TERMS_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##DOMESTIC-TERMS_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));