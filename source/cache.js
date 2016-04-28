!function() {
	var fs = require('fs');
	var path = require('path');
	var os = require('os');

	// 遍历目录
	function readdir(dir, attr) {
		attr || (attr = {});
		var is_not_recursive = attr.is_not_recursive;
		if(fs.existsSync(dir)) {
			var stat = fs.statSync(dir);
			if(stat.isDirectory()) {
				var return_val = [];
				var files = fs.readdirSync(dir);
				var is_mtime = attr.mtime;
				files.sort().forEach(function(file) {
					var fullName = path.join(dir, file);
					var stat_file = fs.statSync(fullName);
					var isDir = stat_file.isDirectory();
					var obj = {name: fullName};
					if(is_mtime){
						obj.mtime = stat_file.mtime;
					}
					if (isDir) {
						obj.sub = is_not_recursive? []: readdir(fullName);
					}
					return_val.push(obj);
				});
				return return_val;
			}
		}
	}
	function rmfileSync(p, is_not_rmmyself_if_directory) {
	    //如果文件路径不存在或文件路径不是文件夹则直接返回
	    try{
	    	if(fs.existsSync(p)){
		    	var stat = fs.statSync(p);
		    	if(stat.isDirectory()){
		    		var files = fs.readdirSync(p);
		    		files.forEach(function(file) {
			            var fullName = path.join(p, file);
			            if (fs.statSync(fullName).isDirectory()) {
			                rmfileSync(fullName);
			            } else {
			                fs.unlinkSync(fullName);
			            }
			        });
				    !is_not_rmmyself_if_directory && fs.rmdirSync(p);
		    	}else{
		    		fs.unlinkSync(p);
		    	}
		    }
	    	return true;
	    }catch(e){}
	}

	var CONST_TIME_CACHE = 2 * 24 * 60 * 60 * 1000;	
	function _deal(dir) {
		var now = new Date().getTime();
		var files = readdir(path.join(os.tmpDir(), 'cwtv', dir), {
			mtime: true
		});
		files.forEach(function(file) {
			if (now - file.mtime > CONST_TIME_CACHE) {
				rmfileSync(file.name);
			}
		});
	}

	// 清除imgs下的图片
	_deal('imgs');
}()