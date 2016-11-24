!function() {
    /**
     * 此脚本主要为了缓存 minifest.js 内容，提高页面打开速度，防止外部链接脚本同步加载对页面的堵塞
     */
    var path = require('path');
    var fs = require('fs');
    var win = require('electron').remote.getCurrentWindow();
    var CONST_USER = win._PACKAGE.PATH.USER;
    
    var url_minifest = 'https://embed.windyty.com/gfs/minifest.js';
    var mkdir = Util.file.mkdir;
    var file_minifest = path.join(CONST_USER, 'minifest.js');

    function _writeMinifest() {
        var content = 'var minifest = '+JSON.stringify(minifest);
        mkdir(path.dirname(file_minifest));
        fs.writeFileSync(file_minifest, content);
    }
    if (fs.existsSync(file_minifest)) {
        document.write('<script src="'+file_minifest+'"></script>');
        $.getScript(url_minifest, function() {
            _writeMinifest();
        });
    } else {
        var fnname = 'cb_'+new Date().getTime();
        window[fnname] = function() {
            _writeMinifest();
            delete window[fnname];
        }
        document.write('<script src="'+url_minifest+'" onload="'+fnname+'()"></script>');
    }
}()
