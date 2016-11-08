!function() {
    var fs = require('fs');
    var path = require('path');
    var crypto = require('crypto');

    var userPath = path.join(require('os').homedir(), 'BPA', 'TOUCH');
    var confPath = path.join(userPath, 'user.conf');
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

        _menuAddId(conf.menu);
        return conf;
    }
    /**
     * 用户本地配置
     */
    Tool.setConf = function(conf) {
        var content = JSON.stringify(conf);

        fs.writeFileSync(confPath, _encode(content));
    }

    Tool.getMenuMixture = function(isAppend) {
        var menuAll = Tool.getMenu();
        var conf = Tool.getConf() || {};
        var menu = conf.menu || [];

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

    // 进行初始化
    mkdirSync(userPath);
    module.exports = Tool; 
}()