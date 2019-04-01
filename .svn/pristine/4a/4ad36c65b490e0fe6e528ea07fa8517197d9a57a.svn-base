const config = require('configModule');
const content = require('./content.ejs'); 
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##CHEAP-FLIGHTS-BOOKING-APP_TITLE_VALUE##}}';
let metaDescription = '{{##CHEAP-FLIGHTS-BOOKING-APP_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##CHEAP-FLIGHTS-BOOKING-APP_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));

 