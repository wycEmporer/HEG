const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##AIRLINES_INDIGO_TITLE_VALUE##}}';
let metaDescription = '{{##AIRLINES_INDIGO_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##AIRLINES_INDIGO_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription
}).run(content(dirsConfig));
