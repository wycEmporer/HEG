const config = require('configModule');
const content = require('./content.ejs'); 
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##REFERRAL-TERMS_TITLE_VALUE##}}';
let metaDescription = '{{##REFERRAL-TERMS_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##REFERRAL-TERMS_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));
