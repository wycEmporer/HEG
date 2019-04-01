const config = require('configModule');
const content = require('./content.ejs'); 
const noJquery = require('withoutJqueryModule');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##DUSSEHRA-MEGA-SALE_TITLE_VALUE##}}';
let metaDescription = '{{##DUSSEHRA-MEGA-SALE_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##DUSSEHRA-MEGA-SALE_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));

