var gulp = require('gulp');
var electron = require('gulp-atom-electron');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var package = require(path.join(__dirname, '../../source/package'));
var pathIcon = path.join(__dirname, './resource/BPA.ico');
var version = package.version;
var through = require('through2');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var symdest = require('gulp-symdest');

var EXE_NAME = 'BPA.exe';

var tmpdir = path.join(__dirname, 'tmp');
var packagejs_file = path.join(tmpdir, 'package.js');
function mkdirSync(mkPath) {
    try{
        var parentPath = path.dirname(mkPath);
        if(!fs.existsSync(parentPath)){
            mkdirSync(parentPath);
        }
        if(!fs.existsSync(mkPath)){
            fs.mkdirSync(mkPath);
        }
        return true;
    }catch(e){}
}
var DEFAULT_KEY = 'TOUCH';
var METHOD_ALGORITHM = 'aes-256-cbc';
function _encode(str, key) {
    var cip = crypto.createCipher(METHOD_ALGORITHM, key || DEFAULT_KEY);
    return cip.update(str, 'utf8', 'hex') + cip.final('hex');
}
function _decode(str, key) {
    var decipher = crypto.createDecipher(METHOD_ALGORITHM, key || DEFAULT_KEY);
    var result = decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
    return result;
}
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
    var url_download = 'https://download.tianqi.cn/BPA/TOUCH/';
    return through.obj(function(file, encoding, cb) {
        var fs = require('fs'),
            path = require('path');

        var pathPackage = path.join(pathDest, 'package.json');

        var data = require(pathPackage);
        delete data.debug;
        delete data.DEBUG;

        var result = JSON.stringify(data);
        fs.writeFileSync(pathPackage, result, 'utf8');

        mkdirSync(tmpdir);
        var content = 'bpa_touch_package('+JSON.stringify({
            version: version,
            packages: {
                win32: {
                    url: url_download + _getExeName('ia32', '.exe')
                },
                win64: {
                    url: url_download + _getExeName('x64', '.exe')
                }
            }
        })+')';
        fs.writeFileSync(packagejs_file, content, 'utf8');

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
            "MyOutputBaseFilename": _getExeName(arch),
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
function _getExeName(arch, suffix) {
    return "BPA-TOUCH-v"+(version.replace('^v', ''))+"-win32-"+ arch + (suffix || '');
}
var UploadConf = (function() {
    var pathDev = path.join(require('os').homedir(), 'BPA', 'TOUCH', '.dev');
    var fileUpload = path.join(pathDev, 'upload.conf');

    mkdirSync(pathDev);

    return {
        set: function(username, pwd, port) {
            // 将用户名、密码及端口号加密写入文件
            fs.writeFileSync(fileUpload, _encode(JSON.stringify({
                username: username,
                pwd: pwd,
                port: port
            })));
        },
        get: function() {
            // 对相关信息进行解密
            try {
                return JSON.parse(_decode(fs.readFileSync(fileUpload, 'utf8')));
            } catch(e) {}
        }
    }
})();
/**
 * 对 download.tianqi.cn 上传进行配置
 */
function _confUserPwd() {
    return through.obj(function(file, encoding, cb) {
        var prompt = '用户名: ';
        process.stdin.setEncoding('utf-8');
        process.stdout.write(prompt);
        process.stdin.resume();
        var name, pwd, port;
        process.stdin.on('data', function(chunk) {
            chunk = chunk.trim();
            if (!chunk) {
                process.stdout.write(prompt);
            } else {
                if (!name) {
                    name = chunk;
                    prompt = '密码: ';
                    process.stdout.write(prompt);
                } else {
                    if (!pwd) {
                        pwd = chunk;
                        prompt = '端口: ';
                        process.stdout.write(prompt);
                    } else {
                        port = chunk;
                        UploadConf.set(name, pwd, port);
                        cb(null, file);

                        process.stdin.pause();
                    }
                }
            }
        })
    })
}
function _console() {
    var args = [].slice.call(arguments);
    return through.obj(function(file, encoding, cb) {
        console.log.apply(console, args);
        cb(null, file);
    })
}

exports.replace = _replace;
exports.electron = _electron;
exports.setup = _setup;
exports.getExeName = _getExeName;
exports.confUserPwd = _confUserPwd;
exports.UploadConf = UploadConf;
exports.console = _console;
exports.getPackageJs = function() {
    return packagejs_file;
}