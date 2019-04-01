const config = require('configModule');
const content = require('./content.ejs');
const dirsConfig = config.DIRS;
const layout = require('layout');

let metaKeywords = '{{##ACTIVATION_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##ACTIVATION_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle: '{{##ACTIVATION_TITLE_VALUE##}}',
  metaKeywords,
  metaDescription,
}).run(content(dirsConfig));