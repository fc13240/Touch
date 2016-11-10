var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var clean = require('gulp-clean');
var symdest = require('gulp-symdest');
var replace = require('gulp-replace');
var gulpUtil = require('gulp-util');
var libs = require('./libs');
var electron = libs.electron;
var runSequence = require('run-sequence');

var pathSource = path.join(__dirname, '../../source');
var pathDest = path.join(__dirname, 'dest');
var pathDest32 = path.join(__dirname, 'dest32');
var pathDest64 = path.join(__dirname, 'dest64');
var pathRealse = path.join(__dirname, 'release');

gulp.task('clean', function() {
    return gulp.src(pathDest)
                .pipe(clean());
});
//压缩JS
gulp.task('mini-js', ['clean'], function() {
    var p = path.join(pathSource, '**/**.js');
    return gulp.src(p)
                // 增加错误输出，方便排错
                .pipe(uglify().on('error', gulpUtil.log))
                .pipe(gulp.dest(pathDest));
});
//压缩CSS
gulp.task("mini-css", ['clean'], function() {
    var p = path.join(pathSource, '**/**.css');
    return gulp.src(p)
                .pipe(cssmin())
                .pipe(gulp.dest(pathDest));
});
//copy静态文件
gulp.task("copy-files", ["clean"], function() {
    var exts = ['html', 'gif', 'png', 'bmp', 'jpg', 'svg', 'json', 'eot', 'ttf', 'woff', 'ico', 'conf'];
    exts.forEach(function(v, i) {
        exts[i] = path.join(pathSource, '**/**.'+v);
    })
    return gulp.src(exts).pipe(gulp.dest(pathDest));
});
//整个压缩及copy文件
gulp.task('mini-code', ["mini-js", "mini-css", "copy-files"], function(){
    return gulp.src('')
            .pipe(libs.replace(pathDest))
});

//清除32打包目录
gulp.task('clean-package-32', function() {
    return gulp.src(pathDest32)
                .pipe(clean());
});
//清除64打包目录
gulp.task('clean-package-64', function() {
    return gulp.src(pathDest64)
                .pipe(clean());
});
//打包32
gulp.task('package-32', ['clean-package-32', 'mini-code'], function() {
    return electron('ia32', pathDest, pathDest32);
});
//打包64
gulp.task('package-64', ['clean-package-64', 'mini-code'], function() {
    return electron('x64', pathDest, pathDest64);
});
gulp.task('package-test', function() {
    return electron('x64', pathDest, pathDest64);
});
//打包所有
gulp.task('package', ['package-32', 'package-64'], function(){})

gulp.task('setup-32', function() {
    return gulp.src('')
            .pipe(libs.setup('ia32', pathDest32))
});
gulp.task('setup-64', function() {
    return gulp.src('')
            .pipe(libs.setup('x64', pathDest64))
});
gulp.task('setup', ['setup-32', 'setup-64'], function() {
});

// gulp.task('_package', ['mini-code'])
// gulp.task('_setup', ['_package'])
gulp.task('default', function() {
    runSequence('package', 'setup');
})