var os = require('os');
var URL = require('url');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var http = require('http');
var exec = require('child_process').exec;
var fn_err = function() {
    console.log.apply(console, arguments);
}

var URL_BPA = 'http://bpa.tianqi.cn';
var URL_UUID = URL_BPA+'/client/getuuid';
var URL_REGISTER = URL_BPA+'/client/register';
var URL_HEARTBEAT = URL_BPA+'/client/heartbeat';
var package = require('../../package');
var CONST_SOFTTYPE = package.softtype;;
// 对设备进行注册
var DELAY = 1000*60*60*4;

var user = localStorage.getItem('user');
var userId = -1;
if (user) {
    user = JSON.parse(user);
    userId = user.id;
}
// 原生请求
var req = (function() {
    function _get(option) {
        var url = option.url;
        var data = option.data;
        var cb = option.onfinish;
        var onresponse = option.onresponse;

        data = querystring.stringify(data);
        if (data) {
            url += (url.indexOf('?') > -1? '&':'?')+data;
        }
        http.get(url, function(res) {
            onresponse && onresponse(res);
            var result = '';
            res.on('data', function(chunk) {
                result += chunk;
            }).on('end', function() {
                cb(null, result.trim());
            });
        }).on('error', cb);
    }
    function _post(option) {
        var url = option.url;
        var data = option.data;
        var cb = option.onfinish;
        var onresponse = option.onresponse;
        
        var opt = URL.parse(url);
        var options = {
            host: opt.host,
            path: opt.path,
            port: opt.port || 80,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };

        var req = http.request(options, function(res) {
            onresponse && onresponse(res);
            res.setEncoding('utf8');
            var content = '';
            res.on('data', function(chunk) {
                content += chunk;
            }).on('end', function() {
                try {
                    var obj = JSON.parse(content);
                    content = obj;
                } catch(e) {}

                cb && cb(null, content);
            }).on('error', cb);
        }).on('error', cb);

        var post_data = querystring.stringify(data);
        req.end(post_data);
    }
    return {
        get: _get,
        post: _post
    }
})();
// 运行在单独的UI线程上
var _getUuid = (function() {
    var vals = ['Serial', 'UUID'];
    var cmd = '';
    var delimiter = ': ';
    switch (process.platform) {
        case 'win32':
            delimiter = '\r\n';
            vals[0] = 'IdentifyingNumber';
            cmd = 'wmic csproduct get ';
            break;
        case 'darwin':
            cmd = 'system_profiler SPHardwareDataType | grep ';
            break;
        case 'linux':
        case 'freebsd':
            cmd = 'dmidecode -t system | grep ';
            break;
    }
    vals.reverse();

    var parseResult = function(input) {
        return input.slice(input.indexOf(delimiter) + 2).trim();
    };

    function getFromNet(cb) {
        // 可能由于权限问题读取不到UUID时，从网络上得到一个唯一码，为了防止每次
        // 进入都要重新获取，把结果缓存起来
        var path_user = path.join(require('os').homedir(), 'BPA');
        require('../util').file.mkdir(path_user);
        var filename = path.join(path_user, '.uuid');
        if (fs.existsSync(filename)) {
            var id = fs.readFileSync(filename, 'utf-8');
            if (id) {
                return cb(null, id);
            }
        }
        req.get({
            url: URL_UUID,
            onfinish: function(err, result) {
                if (result.length > 2) {
                    var id = result.trim();
                    fs.writeFileSync(filename, id);
                    cb(null, id);
                } else {
                    cb(new Error('can get uuid!'));
                }
            }
        });
    }

    // 修复windows203上，执行外部命令时一直等待
    var delay = 2000;
    return function(cb) {
        var tt, child_exec;
        function _end() {
            clearTimeout(tt);
            child_exec && child_exec.kill(); //退出子进程
        }
        function timeout(isEnd) {
            _end();
            if (!isEnd) {
                tt = setTimeout(function() {
                    getFromNet(cb);
                }, delay);
            } else {
                getFromNet(cb);
            }
        }
        timeout();
        child_exec = exec(cmd + vals[0], function(err, stdout) {
            if (!err) {
                var result = parseResult(stdout);
                if (result.length > 1) {
                    _end();
                    return cb(null, result);
                }
            }
            timeout();
            child_exec = exec(cmd + vals[1], function(err, stdout) {
                if (!err) {
                    var result = parseResult(stdout);
                    if (result.length > 1) {
                        _end();
                        return cb(null, result);
                    }
                }
                timeout(true);
            });
        });
    }
})();

// 注册机器
function _register(register_id, cb) {
    _getUuid(function (err, uuid) {
        console.log(err, uuid);
        if (err) {
            fn_err('report: '+err);
            cb(err);
        } else {
            req.post({
                url: URL_REGISTER,
                data: {
                    id: register_id,
                    uuid: uuid,
                    user_id: userId,
                    type: CONST_SOFTTYPE,
                    platform: os.platform(),
                    arch: os.arch()
                },
                onfinish: function(err, result) {
                    console.log(err, result);
                    if (err) {
                        fn_err('report: '+err);
                        return cb && cb(err);
                    }
                    if (result && result.code == 200) {
                        cb && cb(null, {
                            id_old: register_id,
                            id_new: result.id
                        });
                    } else {
                        cb && cb(result);
                    }
                }
            });
        }
    });
}
// 心跳检测
function _heartbeat(register_id, cb) {
    req.post({
        url: URL_HEARTBEAT,
        data: {
            id_reg: register_id,
            id_user: userId,
            id_l: licence_id,
            v: package.version
        },
        onfinish: cb
    });	
}

var reg_id = -1;
var licence_id = '6fe61cc48dc859340e97fe021d554ba1'

function run() {
    var licence = require('../util').verification.get();
    if (licence) {
        licence_id = licence.id;
    }
    _register(reg_id, function(err, data) {
        if (!err && data) {
            reg_id = data.id_new;

            _heartbeat(reg_id, function(err) {
                console.log(err);
                if (err) {
                    fn_err('report: '+err);
                }

                setTimeout(run, DELAY);
            });
        } else {
            fn_err('report: '+err);
            setTimeout(run, DELAY);
        }
    });
}

if (!package.debug) {
    run();
}
