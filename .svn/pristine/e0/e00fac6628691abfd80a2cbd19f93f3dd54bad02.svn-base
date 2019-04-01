const config = require('configModule');
const noJquery = require('withoutJqueryModule');
const layout = require('./html.ejs'); // 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
const header = require('../../components/header/header.ejs'); // 页头的模板
const footer = require('../../components/footer/footer.ejs'); // 页脚的模板
// const topNav = require('../../components/nav/nav.ejs'); // 顶部栏的模板
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
  /* 整合各公共组件和页面实际内容，最后生成完整的HTML文档 */
  run(content) {
    const headerRenderData = Object.assign({}, dirsConfig, pf); // 页头组件需要加载css/js等，因此需要比较多的变量
    const renderData = {
      head : head(headerRenderData),
      header: header(headerRenderData),
      footer: footer(),
      // topNav: topNav(pf),
      content,
    };
    return layout(renderData);
  },  
};

module.exports = moduleExports;