const config = require('configModule');
const content = require('./content.ejs'); 
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##SPRINGTRAVEL-TERMS_TITLE_VALUE##}}';
let metaDescription = '{{##SPRINGTRAVEL-TERMS_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##SPRINGTRAVEL-TERMS_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));

