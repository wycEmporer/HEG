var glob = require('glob');
var path = require('path');
var dirVars = require('./dir-vars.config.js');

// var options = {
//   cwd: dirVars.pagesDir, // 在pages目录里找
//   sync: true, 
// };
//var globInstance = new glob.Glob('!(_)*/!(_)*', options); 
//module.exports = globInstance.found; // 一个数组，形如['index/index', 'index/login', 'alert/index']

function pagesToPath(pattern){
  return glob.sync('**/!(_)*/html.js', {cwd: dirVars.pagesDir}).map(filename => ({
    pathname: path.dirname(filename),
    name: path.dirname(filename).replace(/_\w+\//g, '')  
  }));
}

module.exports = {pagesToPath};