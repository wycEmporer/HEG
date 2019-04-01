const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;

let metaKeywords = '{{##AIRLINES-NOTIFICATION_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##AIRLINES-NOTIFICATION_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle: '{{##AIRLINES-NOTIFICATION_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
}).run(content(dirsConfig));