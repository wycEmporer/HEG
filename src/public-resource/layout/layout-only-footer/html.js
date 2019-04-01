const config = require('configModule');
const noJquery = require('withoutJqueryModule');
const layout = require('./html.ejs');
const head = require('../../components/head/head.ejs');
const footer = require('../../components/footer/footer.ejs');
const dirsConfig = config.DIRS;

const pf = {
  pageTitle: '',
  scriptStr:'',
  metaKeywords:'',
  metaDescription:'',
  constructInsideUrl: noJquery.constructInsideUrl,
};
const moduleExports = {
  /* 处理各个页面传入而又需要在公共区域用到的参数 */
  init({ pageTitle, scriptStr, metaKeywords, metaDescription }) {
    pf.scriptStr = scriptStr;
    pf.pageTitle = pageTitle;
    pf.metaKeywords = metaKeywords;
    pf.metaDescription = metaDescription;
    return this;
  },
  run(content) {
    const headerRenderData = Object.assign({}, dirsConfig, pf);
    const renderData = {
      head: head(headerRenderData),
      content,
      footer:footer(),
    };
    return layout(renderData);
  },
};

module.exports = moduleExports;
