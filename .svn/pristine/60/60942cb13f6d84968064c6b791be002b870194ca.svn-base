var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var dirVars = require('../webpack-config/base/dir-vars.config.js');

rimraf(dirVars.buildDir, fs, function cb() {
  console.log('build dir has delected');
  //如果是目录后面最好加/
  // fs.mkdir(dirVars.buildDir);
  var stat = fs.stat;

  /**
   * copy
   * @param  {str} src source dir
   * @param  {str} dst  destination dir
   * @return {[type]}     [description]
   */
  function copy(src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function(err, paths) {
      if (err) {
        throw err;
      }
      paths.forEach(function(path) {
        var _src = src + '/' + path,
          _dst = dst + '/' + path,
          readable, writable;
        stat(_src, function(err, st) {
          if (err) {
            throw err;
          }
          // 判断是否为文件
          if (st.isFile()) {
            // 创建读取流
            readable = fs.createReadStream(_src);
            // 创建写入流
            writable = fs.createWriteStream(_dst);
            // 通过管道来传输流
            readable.pipe(writable);
          }
          // 如果是目录则递归调用自身
          else if (st.isDirectory()) {
            exists(_src, _dst, copy);
          }
        });
      });
    });
  }
  // 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
  function exists(src, dst, callback) {
    fs.exists(dst, function(isExists) {
      if (isExists) {
        callback(src, dst);
      }
      else {
        exists(src, path.dirname(dst), function(){
          fs.mkdir(dst, function() {
            callback(src, dst);
          });
        });
      }
    });
  }
  // 复制目录
  var imgDir = path.resolve(dirVars.imgsDir, './air-logo');
  var newimgDir = path.resolve(dirVars.staticRootDir, './build/static/images/');
  var tplDir = path.resolve(dirVars.componentsDir, './tpl');
  var newtplDir = path.resolve(dirVars.buildDir, './static/tpl/');

  exists(dirVars.imgsDir, newimgDir, copy);
  // exists(path.resolve(dirVars.imgsDir, './sprite'), path.resolve(dirVars.staticRootDir, './build/static/images/sprite/'), copy);
  exists(tplDir, newtplDir, copy);
  
});
