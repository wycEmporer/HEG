const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##ABOUTUS_TITLE_VALUE##}}';
let metaDescription = '{{##ABOUTUS_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##ABOUTUS_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaDescription, metaKeywords
}).run(content(dirsConfig));
