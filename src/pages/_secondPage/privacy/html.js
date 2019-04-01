const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##PRIVACY_TITLE_VALUE##}}';
let metaDescription = '{{##PRIVACY_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##PRIVACY_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));