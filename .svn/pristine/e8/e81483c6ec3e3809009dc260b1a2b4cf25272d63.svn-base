const config = require('configModule');
const content = require('./content.ejs');
const dirsConfig = config.DIRS;
const layout = require('layout');
let metaKeywords = '{{##PASSPORT_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##PASSPORT_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle: '{{##PASSPORT_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
}).run(content(dirsConfig));