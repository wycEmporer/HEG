const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;

let pageTitle = '{{##AIRLINES_GOINDIA_TITLE_VALUE##}}';
let metaDescription = '{{##AIRLINES_GOINDIA_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##AIRLINES_GOINDIA_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription
}).run(content(dirsConfig));