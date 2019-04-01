const config = require('configModule');
// const noJquery = require('withoutJqueryModule');
const content = require('./main.ejs');
const headScript = require('./headScript.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
// const roundContent = require('./templates/round-content.ejs')({
//   constructInsideUrl: noJquery.constructInsideUrl,
// });
// 上面多加是数据直接渲染
// const renderData = Object.assign(dirsConfig, {roundContent });
const pageTitle = '{{##FLIGHTS_TITLE_VALUE##}} ';

let metaKeywords = '{{##FLIGHTS_META_KEYWORDS_VALUE##}}';
let metaDescription = '{{##FLIGHTS_META_DESCRIPTION_VALUE##}}';

module.exports = layout.init({
  pageTitle,
  metaKeywords,
  metaDescription,
  scriptStr:headScript()
}).run(content(dirsConfig));