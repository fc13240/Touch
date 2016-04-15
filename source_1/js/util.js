!function(G) {
	if (is_native) {
		var ext = require.extensions;
		ext['.gts'] = ext['.js'];
		var request = require('request');
		var fs = require('fs');
		var path = require('path');
		var URL = require('url');
		var os = require('os');
		var crypto = require('crypto');

		var TMP_DIR = path.join(os.tmpDir(), 'cwtv');
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

		function _download(url, savepath, cb) {
			if (typeof savepath == 'function') {
				cb = savepath;
				savepath = '';
			}
			savepath = path.join(TMP_DIR, savepath);

			var info = URL.parse(url);
			var filename = path.basename(info.pathname);
			var new_path = path.join(savepath, filename);

			if (fs.existsSync(new_path)) {
				cb && cb(new_path);
			} else {
				mkdirSync(savepath);

				var ws = fs.createWriteStream(new_path);
				request(url).pipe(ws);
				ws.on('finish', function() {
					cb && cb(new_path);
				})
			}
		}
	} else {
		function _download(url, savepath, cb) {
			if (typeof savepath == 'function') {
				cb = savepath;
				savepath = '';
			}
			cb && cb(url);
		}
	}


	_download.video = function(url, cb) {
		_download(url, 'video', cb);
	}
	/*时间格式化*/
	Date.prototype.format = Date.prototype.format || function(format,is_not_second){
		format || (format = 'yyyy-MM-dd hh:mm:ss');
		var o = {
			"M{2}" : this.getMonth()+1, //month
			"d{2}" : this.getDate(),    //day
			"h{2}" : this.getHours(),   //hour
			"m{2}" : this.getMinutes(), //minute
			"q{2}" : Math.floor((this.getMonth()+3)/3),  //quarter
		}
		if(!is_not_second){
			o["s{2}"] = this.getSeconds(); //second
			o["S{2}"] = this.getMilliseconds() //millisecond
		}
		if(/(y{4}|y{2})/.test(format)){
			format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
		}
		for(var k in o){
			if(new RegExp("("+ k +")").test(format)){
				format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
			}
		}

		return format;
	}
	var PRIVATE_KEY = 'lanpai';
	var APPID = 'fx8fj7ycj8fhbgdt';
	function _encryURL(url) {
	    var myDate = new Date();
        var date = myDate.format('yyyyMMdd');
	    url += (~url.indexOf('?')?'&':'?') + 'date='+date+'&appid='+APPID;
	    var hmac = crypto.createHmac('sha1', PRIVATE_KEY);
	    hmac.write(url);
	    hmac.end();
	    var key = hmac.read().toString('base64');
	    key = encodeURIComponent(key);

	    return url.replace(/appid=.*/,'appid='+APPID.substr(0,6)) + '&key=' + key;
	}

	// console.log(_encryURL('http://scapi.weather.com.cn/weather/micapsfile?fileMark=stream_200&isChina=false'));
	// _download('http://eyes.welife100.com/webcam/v/SWEEYESJSYC01_24H_201501211651.mp4?test&123', 'video', function(src) {
	// 	console.log('down', src);
	// });

	var _reqCache = (function() {
		var _cache = {};
		var uniqueUrl;
		var fn = function(url, option, cb) {
			if (typeof option == 'function') {
				cb = option;
				option = null;
			}
			option = $.extend(true, {
				type: 'json',
				unique: true,
				loading: true
			}, option);

			if (option.unique) {
				uniqueUrl = url;
			}
			var val = _cache[url];
			if (val) {
				var def = $.Deferred();
				def.resolve([val]); // 兼容$.when使用Deferred
				cb && cb(null, val);
				return def;
			} else {
				if (option.loading) {
					Loading.req();	
				}
				var is_json = option.type == 'json';
				return $[is_json? 'getJSON': 'get'](url, function(data) {
					if (is_json && typeof data == 'string') {
						try {
							data = $.parseJSON(data);
						} catch(e){}
					}
					_cache[url] = data;
					if (uniqueUrl == url) {
						Loading.hide();
						cb && cb(null, data);
					} else {
						console.log(uniqueUrl, url);
					}
				}).error(cb);
			}
		}
		fn.text = function(url, cb) {
			return fn(url, {
				type: 'text'
			}, cb);
		}
		return fn;
	})();
	

	var PI = Math.PI;
	var R_START = -PI/2;
	function Ring(option) {
		option = $.extend(true, {
			percent: 0.2,
			circleOuter: {
				width: 6,
				color: '#ccc'
			},
			circlePercent: {
				width: 6,
				color: 'red'
			},
			animate: true
		}, option);

		if (!option.container) {
			throw new Error('no container!');
		}

		var $container = $(option.container);
		var width = $container.width(),
			height = $container.height();

		var width_circle = Math.min(width, height);
		var center = width_circle/2;
		var $tpl = $('<div style="position:relative;width:100%;height:100%;"><canvas width="'+width_circle+'" height="'+width_circle+'" style="position:absolute;left:50%;top:50%;margin-left:'+(-center)+'px;margin-top:'+(-center)+'px;"></canvas></div>');
		$tpl.appendTo($container);
		var $canvas = $tpl.find('canvas');
		var ctx = $canvas.get(0).getContext('2d');
		this.ctx = ctx;
		this.option = option;

		var percent = option.percent;
		this.setPercent(percent);
	}
	Ring.prototype.setPercent = function(percent) {
		var ctx = this.ctx;
		var option = this.option;
		var $container = $(option.container);
		var width = $container.width(),
			height = $container.height();
		var width_circle = Math.min(width, height);
		var center = width_circle/2;

		ctx.clearRect(0, 0, width, height);
		ctx.save();
		ctx.beginPath();
		var w_outer = option.circleOuter.width;
		var r_outer = center - w_outer;
		ctx.lineWidth = w_outer;
		ctx.strokeStyle = option.circleOuter.color;
		ctx.arc(center, center, r_outer, R_START, 2 * PI+R_START);
		ctx.stroke();

		var to_r = - option.percent * 2 * PI;
		if (to_r != 0) {
			ctx.restore();
			var w_percent = option.circlePercent.width;
			var r_percent = center - w_percent - (w_outer - w_percent);
			ctx.lineWidth = w_percent;
			ctx.strokeStyle = option.circlePercent.color;

			var animate = option.animate;
			var r_current = R_START,
				r_end = R_START + to_r;
			var R_PER = -PI/180*10;
			if (!animate) {
				R_PER = -Math.abs(r_end - r_current);
			}
			function run() {
				ctx.beginPath();
				var r_next = r_current + R_PER;
				ctx.arc(center, center, r_percent, r_current, r_next, true);
				ctx.stroke();
				r_current = r_next;
				if (r_current > r_end) {
					requestAnimationFrame(run);
				}
			}
			setTimeout(run, 500*Math.random());
		}
	}

	var Loading = (function() {
		var $div_loading;
		var fn = function(title) {
			if (!$div_loading) {
				$div_loading = $('<div>').addClass('loading_tip').appendTo('body');
			}
			title = title || '正在加载';
			$div_loading.html('<div class="box">'+title+'</div>').fadeIn();
		}
		fn.req = function() {
			fn('正在请求数据');
		}
		fn.deal = function() {
			fn('正在处理');
		}
		fn.hide = function() {
			$div_loading.hide();
		}
		return fn;
	})();
	// Loading();
	G.Util = {
		download: _download,
		encryURL: _encryURL,
		req: _reqCache,
		UI: {
			Ring: Ring
		},
		Loading: Loading
	}
}(this);