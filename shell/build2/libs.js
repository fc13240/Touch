var gulp = require('gulp');
var electron = require('gulp-atom-electron');
var path = require('path');
var package = require(path.join(__dirname, '../../source/package'));
var pathIcon = path.join(__dirname, './resource/BPA.ico');
var version = package.version;
var through = require('through2');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var symdest = require('gulp-symdest');

var EXE_NAME = 'BPA.exe';

function _electron(arch, pathDest, pathDestArch) {
    arch = arch || 'ia32';
    var opts = {
        "platform": 'win32', 
        "version": "1.3.4",
        "companyName": "北京华风创新网络技术有限公司",
        "copyright": "Copyright @ 2014 tianqi.cn All Right  reserved.",
        "arch": arch,
        "winIcon": pathIcon
    };

    var f = filter(package.softtype+'.exe', {restore: true});
    return gulp.src(pathDest+'/**/**')
        .pipe(electron(opts))
        // .pipe(f)
        // .pipe(rename(EXE_NAME))
        // .pipe(f.restore)
        .pipe(symdest(pathDestArch))
}

//替换文件内容
function _replace(pathDest) {
    return through.obj(function(file, encoding, cb) {
        var fs = require('fs'),
            path = require('path');

        var pathPackage = path.join(pathDest, 'package.json');

        var data = require(pathPackage);
        delete data.debug;
        delete data.DEBUG;

        fs.writeFileSync(pathPackage, JSON.stringify(data), 'utf8');

        cb(null, file);
    });
}

function _setup(arch, pathSource) {
    return through.obj(function(file, encoding, cb) {
        var conf = {
            "MyAppId": "{{A4DA39C5-CE45-4A6E-A07E-120556A1E470}",
            "MyAppName": "蓝PI蚂蚁触屏展示系统",
            "MyAppVersion": version,
            "MyAppPublisher": "北京华风创新网络技术有限公司",
            "MyAppPublisherURL": "http://www.tianqi.com",
            "MyDefaultDirName": "BPA/TOUCH",
            "MyOutputDir": path.join(__dirname, 'release'),
            "MyOutputBaseFilename": "BPA-TOUCH-v"+(version.replace('^v', ''))+"-win32-"+ arch,
            "MySetupIconFile": path.join(__dirname, 'resource/BPA.ico'),
            "MyAppURL": "http://www.tianqi.com/",
            "MyAppExeName": EXE_NAME,
            "MyArch": arch,
            "MySource": pathSource
        }

        var issPath = path.join(__dirname, 'resource/GT.iss');
        var args = [issPath];
        for (var i in conf) {
            args.push('/d'+i+'='+conf[i]);
        }

        var innoSetupPath = path.join(path.dirname(path.dirname(require.resolve('innosetup-compiler'))), 'bin', 'ISCC.exe');

        function _cb(err) {
            cb(err, file);
        }
        require('child_process').spawn(innoSetupPath, args, {
            stdio: 'inherit'
        }).on('error', _cb)
        .on('exit', _cb);
    })
}

function _rename() {
    return through.obj(function(file, encoding, cb) {
        var p = file.path;
    })
}
exports.replace = _replace;
exports.electron = _electron;
exports.setup = _setup;