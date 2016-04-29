!function(G) {
	var _log = function(){}
	try {
		if (require('./conf').debug) {
			_log = function() {
				console.log.apply(console, arguments);
			}
		}
	} catch(e){}
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
		var remote = require('remote');

		var dialog = remote.require('dialog');
		var win_instance = remote.getCurrentWindow();
		alert = function(msg) {
			dialog.showMessageBox(win_instance, {
				type: 'info',
				buttons: ['yes'],
				title: '系统提示',
				message: msg,
				icon: null
			});
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
				loading: true,
				dealError: true,//是否自动处理错误
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
				}).error(function(req, status, error) {
					Loading.hide();
					if (option.dealError) {
						alert('数据请求出现错误！');
					}
					cb && cb(error);
				});
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
			$div_loading && $div_loading.hide();
		}
		return fn;
	})();

	var blurWorker = (function() {
		function fn_worker() {
			function a(a) {
				i = new Uint16Array(a), d = new Uint16Array(a), e = new Uint16Array(a)
			}

			function b(a) {
				j = new Uint32Array(a), f = new Uint32Array(a)
			}

			function c(c, k, l, m, n, o, p, q) {
				q = q || 3, q |= 0;
				var r = o * p;
				r > i.length && a(r), r = Math.max(o, p), r > j.length && b(r);
				var s, t, u, v, w, x, y, z, A, B, C, w, D, x, y, z, E, D = 0,
					F = 0,
					G = 0,
					H = o - 1,
					I = p - 1,
					J = q + 1,
					K = g[q],
					L = h[q],
					M = (1e7 * K >>> L) / 1e7,
					N = j,
					O = f,
					P = i,
					Q = d,
					R = e,
					S = c.data;
				for (B = 0; o > B; B++) N[B] = ((x = B + J) < H ? x : H) << 2, O[B] = (x = B - q) > 0 ? x << 2 : 0;
				for (v = 0; p > v; v++) {
					for (s = S[G] * J, t = S[G + 1] * J, u = S[G + 2] * J, w = 1; q >= w; w++) x = G + ((w > H ? H : w) << 2), s += S[x], t += S[x + 1], u += S[x + 2];
					for (D = 0; o > D; D++) P[F] = s, Q[F] = t, R[F] = u, y = G + N[D], z = G + O[D], s += S[y] - S[z], t += S[y + 1] - S[z + 1], u += S[y + 2] - S[z + 2], F++;
					G += o << 2
				}
				for (C = 0; p > C; C++) N[C] = ((x = C + J) < I ? x : I) * o, O[C] = (x = C - q) > 0 ? x * o : 0;
				for (D = 0; o > D; D++) {
					for (A = D, s = P[A] * J, t = Q[A] * J, u = R[A] * J, w = 1; q >= w; w++) A += w > I ? 0 : o, s += P[A], t += Q[A], u += R[A];
					for (F = D << 2, E = o << 2, v = 0; p > v; v++) S[F] = s * M, S[F + 1] = t * M, S[F + 2] = u * M, y = D + N[v], z = D + O[v], s += P[y] - P[z], t += Q[y] - Q[z], u += R[y] - R[z], F += E
				}
				return c
			}
			var d, e, f, g = [1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107, 3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133],
				h = [0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18, 16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20, 20],
				i = [],
				j = [];
			self.onmessage = function(a) {
				var result = c(a.data.imageData, a.data.x0, a.data.y0, a.data.xMax, a.data.yMax, a.data.width, a.data.height, a.data.radius);
				var opacityScale = a.data.opacityScale;
				if (opacityScale && opacityScale != 1) {
					var data_arr = result.data;
	    			for(var i = 0, j = data_arr.length; i<j; i+= 4){
	    				data_arr[i+3] = Math.min(data_arr[i+3] *opacityScale, 255);
	    			}
	    		}
				postMessage(result);
			}
		}

		var _URL = G.URL || G.webkitURL;
		G.BlobBuilder = G.BlobBuilder || G.WebKitBlobBuilder || G.MozBlobBuilder
		return function() {
			try {
				var str_fn = "(" + fn_worker.toString() + ")()";
				var _blob;
				try {
					_blob = new Blob([str_fn], {
						type: "application/javascript"
					})
				} catch (g) {
					_blob = new BlobBuilder();
					_blob.append(str_fn);
					_blob = _blob.getBlob();
				}
				try {
					if (_blob) {
						return new Worker(_URL.createObjectURL(_blob))
					}
				} catch (g) {
					
				}
			} catch (g) {
				
			}
		}
	})();
	var md5 = (function() {
		var DEFAULT_PRIVATE_KEY = 'cwtv'
		var encrypt = function(str, key){
			if(str && str.toString){
				return crypto.createHash('sha1').update(str.toString() + (key||DEFAULT_PRIVATE_KEY)).digest('hex');
			}
			return '';
		}
		return encrypt;
	})();
	function _saveBase64(save_file_name, img_data){
		img_data = img_data.substring(img_data.indexOf('base64,') + 7);
		img_data = new Buffer(img_data, 'base64');

		mkdirSync(path.dirname(save_file_name));
		fs.writeFileSync(save_file_name, img_data);

		return img_data;
	}
	var _saveImg = (function() {
		var canvas = document.createElement("canvas");
		var cxt = canvas.getContext('2d');
		return function(savepath, img, cb, is_return_data) {
			if (({}).toString.call(img) != '[object HTMLImageElement]') {
				var _data = img;
				img = new Image();
				img.src = _data;
			}
			canvas.width = img.width;
			canvas.height = img.height;
			cxt.drawImage(img, 0, 0);
			var dataURL = canvas.toDataURL('image/png');

			_saveBase64(savepath, dataURL);
			cb && cb (dataURL);
		}
	})();
	function _getCachePath() {
		var arv = [].slice.call(arguments);
		arv.unshift(os.tmpDir(), 'cwtv');
		return path.join.apply(path, arv);
	}
	function _getImgCachePath(url) {
		var key = md5(url);
		return _getCachePath('imgs', key+'.png');
	}
	function _loadImg(src, option) {
		var onload = option.onload;
		var onerror = option.onerror;
		var fn_deal = option.fn_deal;
		var src_return = src;
		var is_net = /^http/.test(src);
		var is_cache = false;
		if (is_net) {
			var fn_cache = option.fn_cache || function() {
				return _getImgCachePath(src);
			};
			var _cachePath = fn_cache();
			console.log(_cachePath);
			if (fs.existsSync(_cachePath)) {
				src_return = src = _cachePath;
				is_cache = true;
				_log('_cachePath = ', _cachePath);

				var img = new Image();
				img.src = _cachePath;
				onload && onload.call(img, _cachePath);
				return _cachePath;
			}
		}
		

		var img = new Image();
		img.onload = function() {
			if (is_net && !is_cache) {
				_log('loadimage = ', src);
				if (fn_deal) {
					fn_deal(img, function(img_data) {
						_saveImg(_cachePath, img_data);
						var img = new Image();
						img.src = _cachePath;
						onload && onload.call(img, _cachePath);
					});
					return;
				}
				_saveImg(_cachePath, img);
				src_return = _cachePath;
			}
			onload && onload.call(this, src_return);
		}
		img.onerror = function(e) {
			onerror && onerror.call(this, e);
		}
		// img.crossOrigin = '';
		img.src = src;
		return src_return;
	}
	// Loading();
	module.exports = G.Util = {
		download: _download,
		encryURL: _encryURL,
		req: _reqCache,
		UI: {
			Ring: Ring
		},
		Loading: Loading,
		log: _log,
		md5: md5,
		getBlurWorker: blurWorker,
		img: {
			load: _loadImg,
			getCachePath: function(url) {
				return _getImgCachePath(url);
			}
		},
		getCachePath: _getCachePath
	}
}(this);