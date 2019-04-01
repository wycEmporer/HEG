const config = require('configModule');
const content = require('./content.ejs'); 
const noJquery = require('withoutJqueryModule');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##OFFERS_NEWYEARSALE2019_TITLE_VALUE##}}';
let metaDescription = '{{##OFFERS_NEWYEARSALE2019_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##OFFERS_NEWYEARSALE2019_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));

