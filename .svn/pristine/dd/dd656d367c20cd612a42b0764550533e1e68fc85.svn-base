const config = require('configModule');
const content = require('./content.ejs'); 
const layout = require('layout');
const dirsConfig = config.DIRS;
let metaKeywords = '{{##CASHBACK_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##CASHBACK_META_DESCRIPTION_VALUE##}}';
module.exports = layout.init({
  pageTitle: '{{##CASHBACK_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
}).run(content(dirsConfig));
