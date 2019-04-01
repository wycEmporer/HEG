var path = require('path');
var dirVars = require('./base/dir-vars.config.js');
var pageArr = require('./base/page-entries.config.js');
var configEntry = {};
pageArr.pagesToPath().forEach((item) => {
  configEntry[item.name] = path.resolve(dirVars.pagesDir, item.pathname + '/page.js');
});

module.exports = configEntry;
