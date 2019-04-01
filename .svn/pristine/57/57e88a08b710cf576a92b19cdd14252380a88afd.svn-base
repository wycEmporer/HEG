const config = require('configModule');
const content = require('./content.ejs'); 
const noJquery = require('withoutJqueryModule');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##GRAB-CASHBACK_TITLE_VALUE##}}';
let metaDescription = '{{##GRAB-CASHBACK_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##GRAB-CASHBACK_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));

