const config = require('configModule');
const content = require('./content.ejs');
const headScript = require('./headScript.ejs');
const layout = require('newLayout');
const dirsConfig = config.DIRS;
let metaKeywords = '{{##INDEX_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##INDEX_META_DESCRIPTION_VALUE##}}';
module.exports = layout.init({
  pageTitle: '{{##INDEX_TITLE_VALUE##}}', scriptStr:headScript(), metaDescription, metaKeywords
}).run(content(dirsConfig));
