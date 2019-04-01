const config = require('configModule');
const content = require('./content.ejs'); 
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##WALLET-TERMS_TITLE_VALUE##}}';
let metaDescription = '{{##WALLET-TERMS_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##WALLET-TERMS_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));
