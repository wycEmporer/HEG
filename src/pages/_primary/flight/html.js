const config = require('configModule');
const content = require('./content.ejs');
const headScript = require('./headScript.ejs');
const layout = require('newLayout');
const dirsConfig = config.DIRS;
let metaKeywords = '{{##FLIGHT_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##FLIGHT_META_DESCRIPTION_VALUE##}}';
module.exports = layout.init({
  pageTitle: '{{##FLIGHT_TITLE_VALUE##}}', scriptStr:headScript(), metaDescription, metaKeywords
}).run(content(dirsConfig));
