const config = require('configModule');
const content = require('./content.ejs'); 
const noJquery = require('withoutJqueryModule');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##DIWALI-DHAMAKA-SALE_TITLE_VALUE##}}';
let metaDescription = '{{##DIWALI-DHAMAKA-SALE_META_KEYWORDS_VALUE##}}';
let metaKeywords = '{{##DIWALI-DHAMAKA-SALE_META_DESCRIPTION_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));

