const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##AIRLINES_AIRINDIA_TITLE_VALUE##}}';
let metaDescription = '{{##AIRLINES_AIRINDIA_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##AIRLINES_AIRINDIA_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription
}).run(content(dirsConfig));