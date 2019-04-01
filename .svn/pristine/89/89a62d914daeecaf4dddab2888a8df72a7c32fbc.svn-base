const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##GUARANTEE_TITLE_VALUE##}}';
let metaDescription = '{{##GUARANTEE_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##GUARANTEE_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));