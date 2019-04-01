const config = require('configModule');
const content = require('./content.ejs'); 
const noJquery = require('withoutJqueryModule');
const layout = require('layout-only-header');
const dirsConfig = config.DIRS;
let pageTitle = '{{##FIRST-ANNIVERSARY-OFFERS_TITLE_VALUE##}}';
let metaDescription = '{{##FIRST-ANNIVERSARY-OFFERS_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##FIRST-ANNIVERSARY-OFFERS_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));

