!function() {
    var fs = require('fs');
    var path = require('path');
    var crypto = require('crypto');
    var Tiff = require('../libs/tiff');

    // !!在 32 位电脑上会出现内存溢出问题
    Tiff.initialize({TOTAL_MEMORY: 16777216 * 5 })
    var Util = require('../util');
    var md5 = Util.md5;

    var userPath = path.join(require('os').homedir(), 'BPA', 'TOUCH');
    var confPath = path.join(userPath, 'user.conf');
    var confRemotePath = path.join(userPath, 'user.remote.conf');
    var menuPath = path.resolve(__dirname, '../../data/menu.conf');

    var Tool = {};

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
    
    function _exists(p) {
        return fs.existsSync(p);
    }
    /**
     * 同步新建目录
     */
	function mkdirSync(mkPath) {
		try{
			var parentPath = path.dirname(mkPath);
			if(!_exists(parentPath)){
				mkdirSync(parentPath);
			}
			if(!_exists(mkPath)){
				fs.mkdirSync(mkPath);
			}
			return true;
		}catch(e){}
	}
    function _getEncodeContent(filepath) {
        try {
            var content = fs.readFileSync(filepath, 'utf8');
        } catch(e){}

        if (content) {
            return JSON.parse(_decode(content));
        }
    }

    /**
     * 得到用户本地配置
     */
    Tool.getConf = function() {
        var conf = _getEncodeContent(confPath) || {};

        // _menuAddId(conf.menu);
        return conf;
    }
    Tool.isHaveMenu = function() {
        var conf = Tool.getConf();
        var menu = conf.remote? conf.menuRemote: conf.menu;
        return menu && menu.length > 0;
    }
    function _write(p, content) {
        content = JSON.stringify(content);
        fs.writeFileSync(p, _encode(content));
    }
    /**
     * 用户本地配置
     */
    Tool.setConf = function(conf) {
        _write(confPath, conf);
    }
    Tool.setMenuUser = function(menu) {
        _write(confRemotePath, menu);
    }

    Tool.mixtureMenu = function(menu, isAppend) {
        var menuAll = Tool.getMenu();
        menu = menu || [];

        var cache = {};
        menuAll.forEach(function(v) {
            cache[v.id] = v;
            var sub = v.sub;
            if (sub && sub.length > 0) {
                sub.forEach(function(v1) {
                    cache[v1.id] = v1;
                });
            }
        });

        var menu_new = [];
        _menuAddId(menu);
        menu.forEach(function(v) {
            if (cache[v.id]) {
                var sub = v.sub;
                if (sub && sub.length > 0) {
                    var arr = [];
                    sub.forEach(function(s) {
                        if (cache[s.id]) {
                            delete cache[s.id];
                            arr.push(s);
                        }
                    });
                    if (arr.length > 0) {
                        v.sub = arr;
                    }
                }
                menu_new.push(v);
                delete cache[v.id];
            }
        });

        if (isAppend) {
            for (var i in cache) {
                var val = cache[i];
                val.isAppend = true;
                var id = val.id;
                var id_parts = id.split('_');
                if (id_parts.length == 1) {
                    delete val.sub;
                    menu_new.push(val);
                } else {
                    var id_level1 = id_parts[0];
                    for (var i_arr = 0, j_arr = menu_new.length; i_arr < j_arr; i_arr++) {
                        var item = menu_new[i_arr];
                        if (item.id == id_level1) {
                            (item.sub || (item.sub = [])).push(val);
                            break;
                        }
                    }
                }
            }
        }

        return menu_new;
    }
    Tool.getMenuFront = function() {
        var conf = Tool.getConf() || {};
        var menu = conf.remote? conf.menuRemote: conf.menu;
        return Tool.mixtureMenu(menu);
    }
    /**
     * 得到主界面中使用的图集列表
     */
    Tool.getGallery = function(isFilter) {
        var conf = Tool.getConf() || {};
        var gallery = conf.gallery || {};
        var list = gallery.list || [];
        list.forEach(function(v) {
            var file_source = v.file_source;
            if (file_source) {
                var file = _converTiff(file_source);
                v.file = file;
            }            
        });

        if (isFilter) {
            var list = gallery.list || [];
            list = list.filter(function(v) {
                return v.flag;
            });
            gallery.list = list;
        }

        return gallery;
    }
    /**
     * 设置图片集
     */
    Tool.setGallery = function(gallery) {
        if (gallery) {
            var conf = Tool.getConf() || {};
            conf.gallery = gallery;
            Tool.setConf(conf);
        }        
    }

    /**
     * 得到浮动窗口的配置
     */
    Tool.getSuspended = function(isFilter) {
        var conf = Tool.getConf() || {};
        var suspended = conf.suspended || {};
        var list = suspended.list || [];
        list.forEach(function(v) {
            var file_source = v.file_source;
            if (file_source) {
                var file = _converTiff(file_source);
                v.file = file;
            }            
        });
        if (isFilter) {
            var list = gallery.list || [];
            list = list.filter(function(v) {
                return v.flag;
            });
            gallery.list = list;
        }

        return suspended;
    }
    /**
     * 设置浮动窗口
     */
    Tool.setSuspended = function(suspended) {
        if (suspended) {
            var conf = Tool.getConf() || {};
            conf.suspended = suspended;
            Tool.setConf(conf);
        }
    }
    function _menuAddId(menu) {
        if (menu && menu.length > 0) {
            menu.forEach(function(v) {
                var id = v.name;
                v.id = id;
                var sub = v.sub;
                if (sub && sub.length > 0) {
                    sub.forEach(function(v1) {
                        v1.id = id + '_' + v1.name;
                    });
                }
            });
        }
    }
    /**
     * 得到产品列表的配置
     */
    Tool.getMenu = function(opt) {
        var menuAll = _getEncodeContent(menuPath);

        _menuAddId(menuAll);
        return menuAll;
    }
    Tool.encode = _encode;
    Tool.decode = _decode;

    var Cache = {
        get: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        set: function(key, val) {
            localStorage.setItem(key, JSON.stringify(val));
        }
    }

    function _getType(file) {
        if (fs.statSync(file).isFile()) {
            var ext = path.extname(file).substr(1).toLowerCase();
            if (/^(gif|jpg|png|bmp|tif|tiff)$/.test(ext)) {
                return 'img';
            } else if (/^(mp4|mov)$/.test(ext)) {
                return 'video';
            }
        }
    }
    function _converTiff(file) {
        var ext = path.extname(file).substr(1).toLowerCase();
        if (/^(tif|tiff)$/.test(ext)) {
            var stat = fs.statSync(file);
            var mtime = new Date(stat.mtime).getTime();
            var cache_name = md5(file+'_'+mtime);
            var cache_path = path.join(userPath, 'cache/img');
            var cache_file = path.join(cache_path, cache_name);

            if (!fs.existsSync(cache_file)) {
                mkdirSync(cache_path);
                var bf = fs.readFileSync(file);
                var tiff = new Tiff({
                    buffer: bf
                });

                var data = tiff.toDataURL();
                Util.file.saveBase64(cache_file, data);
                console.log('cache tiff: ', cache_file, file);
            }

            return cache_file;
        }
        return file;
    }
    function _formatSource(files, cb) {
        var arr = [];
        if (files && files.length > 0) {
            files.forEach(function(file) {
                var type = _getType(file);
                if (type) {
                    var file_new = _converTiff(file);
                    var obj = {
                        file: file,
                        type: type,
                        flag: true
                    }
                    if (file_new) {
                        obj.file = file_new;
                        obj.file_source = file;
                    }
                    arr.push(obj);
                }
            });
        }
        cb && cb(null, arr);
    }
    function _readSource(dir, cb) {
        fs.readdir(dir, function(err, files) {
            if (err) {
                cb && cb(err);
            } else {
                files.forEach(function(file, i) {
                    files[i] = path.join(dir, file);
                });
                _formatSource(files, cb);
            }
        });
    }

    Tool.formatSource = _formatSource;
    Tool.readSource = _readSource;

    // 进行初始化
    mkdirSync(userPath);
    module.exports = Tool;
}()