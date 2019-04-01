// gulp.task('minifyjs', function() {

// gulp.src('src/*.js')

//   .pipe(concat('main.js')) //合并所有js到main.js

//   .pipe(gulp.dest('minified/js')) //输出main.js到文件夹

//   .pipe(rename({ suffix: '.min' })) //rename压缩后的文件名

//   .pipe(uglify()) //压缩

//   .pipe(gulp.dest('minified/js')); //输出

// });
// 先安装gulp 及插件; 文件名 gulpfile.js  然后 cmd 运行gulp minifyjs 
var gulp = require('gulp');
var uglify = require('gulp-uglify');
gulp.task('minifyjs', function() {
gulp.src('jquery-ui.js')

  .pipe(uglify())

  .pipe(gulp.dest('./min'));

});