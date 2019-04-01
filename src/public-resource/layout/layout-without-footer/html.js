const config = require('configModule');
const noJquery = require('withoutJqueryModule');
const layout = require('./html.ejs');

const header = require('../../components/header/header.ejs'); 
const topNav = require('../../components/nav/nav.ejs'); // 
const head  = require('../../components/head/head.ejs');
const dirsConfig = config.DIRS;
/* 整理渲染公共部分所用到的模板变量 */
const pf = {
  pageTitle: '',
  scriptStr:'',
  metaKeywords:'',
  metaDescription:'',
  constructInsideUrl: noJquery.constructInsideUrl,
};
const moduleExports = {
  /* 处理各个页面传入而又需要在公共区域用到的参数 */
  init({
 pageTitle, scriptStr, metaKeywords, metaDescription 
}) {
    pf.scriptStr = scriptStr;
    pf.pageTitle = pageTitle;
    pf.metaKeywords = metaKeywords;
    pf.metaDescription = metaDescription;
    return this;
  },
  run(content) {
    const headerRenderData = Object.assign({}, dirsConfig, pf);
    const renderData = {
      head : head(headerRenderData),
      header: header(headerRenderData),
      topNav: topNav(pf),
      content,
    };
    return layout(renderData);
  },
};

module.exports = moduleExports;