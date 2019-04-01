const config = require('configModule');
const content = require('./content.ejs'); 
const noJquery = require('withoutJqueryModule');
const layout = require('layout');
const dirsConfig = config.DIRS;
let pageTitle = '{{##SHAKE_TITLE_VALUE##}}';
let metaDescription = '{{##SHAKE_META_DESCRIPTION_VALUE##}}';
let metaKeywords = '{{##SHAKE_META_KEYWORDS_VALUE##}}';
module.exports = layout.init({
  pageTitle, metaKeywords, metaDescription 
}).run(content(dirsConfig));

