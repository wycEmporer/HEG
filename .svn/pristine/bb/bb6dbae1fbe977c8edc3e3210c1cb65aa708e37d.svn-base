var fs = require('fs');
var path = require('path');
var dirVars = require('../webpack-config/base/dir-vars.config.js');

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
// var oldDirArr = [
//     path.resolve(dirVars.buildDir, './phuket-and-male'),
//     path.resolve(dirVars.buildDir, './pre-diwali-sale')
//   ];
// var newDirArr =  [
//     path.resolve(dirVars.buildDir, './campaigns/international-goair/phuket-and-male'),
//     path.resolve(dirVars.buildDir, './campaigns/hotel/pre-diwali-sale')
//   ];

// oldDirArr.forEach(function(oldDir, index){
//   exists(oldDir, newDirArr[index], copy);
// });

// exists(oldDir, newDir, copy);