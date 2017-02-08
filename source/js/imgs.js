$(function() {
	var runTT;
    var imageOverlays = [];
    var currentIndex = 0;
    var isNormal = true;
    

	var proxy = (function() {
		var pre_url = '';
		if(!is_native){
			pre_url = 'http://10.14.85.116/php/proxy.php?url=';
			// pre_url = './proxy.php?url=';
		}
		var proxy_cache = {};
		return {
			get: function(url, callback){
				url = pre_url+url;
				Util.req(url, callback);
			}
		}
	})();
    var _blurWorker;
    var map;
	W.define("blurWorker", ["log"], function(a) {
		function b() {
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
				postMessage(c(a.data.imageData, a.data.x0, a.data.y0, a.data.xMax, a.data.yMax, a.data.width, a.data.height, a.data.radius))
			}
		}
		var c, d, e = null,
			f = window.URL || window.webkitURL;
		if (!window.Worker) return a.event("Web Worker not supported"), null;
		try {
			d = "(" + b.toString() + ")()";
			try {
				c = new Blob([d], {
					type: "application/javascript"
				})
			} catch (g) {
				window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder, c = new BlobBuilder, c.append(d), c = blob.getBlob(), a.event("Using old version of BlobBuilder, just for info")
			}
			try {
				e = new Worker(f.createObjectURL(c))
			} catch (g) {
				return a.event("Unable to createObjectURL " + g), null
			}
		} catch (g) {
			return a.event("Failed to stringyfy blurFunction " + g), null
		}
		return e
	});
	W.require({
		dependencies:['blurWorker', 'maps'], 
		callback: function(blurWorker, maps) {
			_blurWorker = blurWorker;
    		map = maps;
		}
	});
    var cache_img = {};
    function loadAndCacheImg(url, opacityScale, cb){
    	if (is_native) {
    		Util.img.load(url, {
    			fn_cache: function() {
    				var url_new = url;
    				// 重写云图缓存名
    				if (/product\/cloudnew/.test(url_new)) {
    					var index = url_new.indexOf('?');
    					if (index > -1) {
    						url_new = url_new.substring(0, index);
    					}
    				}
    				return Util.img.getCachePath(url_new);
    			},
    			fn_deal: function(img, onafterdeal) {
    				if (opacityScale != 1) {
    					var canvas = document.createElement('canvas');
			    		var w = img.width, h = img.height;
			    		var TOSIZE = 1400;
			    		if(w>h){
			    			var scale = w/TOSIZE;
			    			w = TOSIZE;
			    			h /= scale;
			    		}else{
			    			var scale = h/TOSIZE;
			    			h = TOSIZE;
			    			w /= scale;
			    		}
			    		w = parseInt(w);
			    		h = parseInt(h);
			    		// w *= 2;
			    		// h *= 2;
			    		canvas.width = w;
			    		canvas.height = h;

			    		var cxt = canvas.getContext('2d');
			    		cxt.drawImage(img, 0, 0, w, h);
		    			var imagedata = cxt.getImageData(0, 0, w, h);

		    			var worker = Util.getBlurWorker();
			    		if(worker){
		    				worker.onmessage = function(a) {
		    					cxt.putImageData(a.data, 0, 0);

								onafterdeal && onafterdeal(canvas.toDataURL("image/png"));

								worker.terminate();
							}

		    				worker.postMessage({
								imageData: imagedata,
								width: w,
								height: h,
								radius: 2,
								opacityScale: opacityScale
							});
							return;
		    			}else{
			    			cxt.putImageData(imagedata, 0, 0);
			    			cache_img[url] = canvas.toDataURL("image/png");
			    		}
    				}
    			},
    			onload: function(img_path) {
    				cache_img[url] = img_path;
    				cb(img_path);
    			}
    		});
    	} else {
    		if(cache_img[url]){
	    		return cb();
	    	}

	    	cache_img[url] = url;
    	}
    }
    var progress = (function() {
    	var $box_player = $('.box_player')
    	var $player_progressbar_progress = $('.player_progressbar_progress'),
			$player_btn = $('.player_btn');
		var $player_progressbar = $('.player_progressbar');

		$player_progressbar.on('click', function(e){
			if(e.originalEvent){
				e = e.originalEvent;
			}
			var per = e.layerX/$player_progressbar[0].offsetWidth;
			var toIndex = Math.floor(per*_totalNum);

			playing = true;
			_click();
			_setIndex(toIndex);
		});
		var autoPlay = true;
		var playing = autoPlay;
		// rootScope.playing = playing;

		function _click(){
			if(playing){
				_pause();
				$player_btn.removeClass('playing');
			}else{
				_play();
				$player_btn.addClass('playing');
			}
			playing = !playing;
		}
		$player_btn.bind('click', _click);
		var _totalNum = 0,
			_nextIndex = 0;
		var delay = 300;
		var playTT;
		function _init(totalNum){
			$box_player.show();
			playing = false;
			_click();
			_totalNum = totalNum;
			autoPlay && this.play();
		}
		function _setIndex(index){
			if(index < 0){
				index = 0;
			}else if(index > _totalNum - 1){
				index = _totalNum - 1;
			}
			$doc.trigger('player_changeindex', {
				index: index
			});
			_nextIndex = index;
			if(_totalNum > 0)
				$player_progressbar_progress.css('width', (_nextIndex/(_totalNum-1)*100)+'%');
		}
		function _play(){
			clearTimeout(playTT);
			var _this = this;
			_setIndex(_nextIndex);
			var next = _nextIndex + 1;
			if(next < 0){
				next = 0
			}else if(next > _totalNum-1){
				next = 0;
			}
			_nextIndex = next;
			playTT = setTimeout(_play, delay);
		}
		function _pause(){
			clearTimeout(playTT);
		}
		return {
			init: _init
			,setIndex: _setIndex
			,play: _play
			,pause: _pause
			,clear: function(){
				_totalNum = 0;
				_nextIndex = 0;
				_pause();
			},
			hide: function() {
				$box_player.hide();
			}, reset: function() {
				this.clear();
				this.hide();
			}
		}
    })();
    var $load_progress_wrap = $('.load_progress_wrap');
    var $doc = $(document).on('load_progress', function(e, per) {
    	if (!isNormal) {
    		return;
    	}
    	if(per < 1){
			$load_progress_wrap.show();
		}else{
			$load_progress_wrap.hide();
		}
		$load_progress_wrap.html((per*100).toFixed(1)+'%');
    });
    $doc.on('change_img', function(e, data){
    	if (!isNormal) {
    		return;
    	}
		var date = new Date(data.time*1000);
		$('.box_title_container .time').show();
		$('#time_top').html(date.format('yyyy年MM月dd日'));
		$('#time_bottom').html(date.format('hh:mm'));
		// progress.setIndex(data.index);
		// b.playing = true;
	});
	$doc.on('player_changeindex', function(e, data){
		if (!isNormal) {
    		return;
    	}
		setIndex(data.index);
	});
    $doc.on('img_inited', function(e, data){
    	if (!isNormal) {
    		return;
    	}
		progress.init(data.total);
	});
    var cache_list = {};
    function loadImgs(list, opacityScale, callback){
    	var key = list.url;
    	if(cache_list[key]){
    		return callback();
    	}
    	list = list.slice();
    	var len = list.length;
    	var loadedNum = 0;
    	function cb(){
    		loadedNum += 1;
    		$doc.trigger('load_progress', loadedNum/len);
    		if(loadedNum >= len){
    			cache_list[key] = true;
    			callback();
    		}
    	}
    	$doc.trigger('load_progress', 0);
    	// function _run () {
    	// 	var item = list.shift();
    	// 	if (item) {
    	// 		loadAndCacheImg(item[0], opacityScale, cb);
    	// 	}
    	// }
    	// _run();
    	for(var i = 0, j = len; i<j; i++){
    		loadAndCacheImg(list[i][0], opacityScale, cb);
    	}
    }
	function initData(list, opacityScale, bounds_default){
		loadImgs(list, opacityScale, function(){
			if (!isNormal) {
				return;
			}

			for(var i = 0, j = list.length; i<j; i++){
	        	var item = list[i];
	        	var imageUrl = item[0];
	        	var bounds = item[2];
	        	var imageBounds = bounds_default || [[bounds[0], bounds[1]], [bounds[2], bounds[3]]];
	        	var overlay = L.imageOverlay(cache_img[imageUrl], imageBounds);
	        	overlay.addTo(map);
	        	overlay.setOpacity(i == 0? 1: 0);
	        	overlay._time = item[1];
	        	imageOverlays.push(overlay);
	        }
	        $doc.trigger('img_inited', {
	        	total: j
	        });
		});
	}
	function setIndex(index){
		var len = imageOverlays.length;
		if(index < 0){
			index = 0;
		}else if(index >= len){
			index = 0;
		}
		for(var i = 0; i<len;i++){
			imageOverlays[i].setOpacity(i == index ? 1: 0);
		}
		currentIndex = index;
		var info = imageOverlays[currentIndex];
 		if (!info) {
			return;
		}
		$doc.trigger('change_img', {
    		url: info._url,
    		time: info._time,
    		index: currentIndex,
    		total: len
    	});
	}
	window.Imgs = {
		init: function(productname){
			this.stop();
			isNormal = true;
			if('radar' == productname){
				var url = 'http://api.tianqi.cn:8070/v1/img.py';
				proxy.get(url, function(err, data){
					var list = data.radar_img;
					list.url = url;
					initData(list, 4);
				});
			}else if('cloud' == productname){
				var url = 'http://radar.tianqi.cn/radar/imgs.php?type=cloud_new';
				// var url = 'http://10.14.85.116/php/radar/imgs.php?type=cloud';
				proxy.get(url, function(err, data){
					var list = [];
					var items = data.l;
					for(var i = items.length-1; i>=0; i--){
						var item = items[i];
						list.push([item['l2'], new Date(item['l1']).getTime()/1000]);
					}
					list.url = url;
					initData(list, 1.1, [[-4.98, 50.02], [59.97, 144.97]]);//西南，东北(纬度，经度)
				});
			}
		},
		setIndex: setIndex,
		stop: function(index){
			if(index !== undefined){
				imageOverlays[currentIndex].setOpacity(0);
				imageOverlays[index].setOpacity(1);
			}
		},
		getOverlays: function(){
			return imageOverlays;
		},
		clear: function(){
			isNormal = false;
			progress.reset();
			var tmp;
			while((tmp = imageOverlays.shift())){
				map.removeLayer(tmp);
			}
		}
	}
})