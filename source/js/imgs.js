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
    W.require.bind(null, ['blurWorker', 'maps'], function(blurWorker, maps) {
    	_blurWorker = blurWorker;
    	map = maps;
    })();
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
    	console.log('progress', per, isNormal);
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
    		loadedNum += 1;console.log(loadedNum/len)
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