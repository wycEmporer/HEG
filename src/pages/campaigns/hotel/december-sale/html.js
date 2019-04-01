const config = require('configModule');
const content = require('./content.ejs'); 
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##CAMPAIGNS_HOTEL_DECEMBERSALE_TITLE_VALUE##}}';
let metaDescription = '{{##CAMPAIGNS_HOTEL_DECEMBERSALE_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##CAMPAIGNS_HOTEL_DECEMBERSALE_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));
