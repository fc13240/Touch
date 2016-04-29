!function() {
	var path = require('path');
	global.is_native = true;
	var Util = require(path.join(__dirname, '../js/util'));

	typeof show_pathinfo == 'function' && show_pathinfo(Util.getCachePath('map'));
	var num_downloaded = 0;
	var NUM_THREAD = 50;
	var num_dealing = 0;
	var queue = [];
	var NUM_MAX_QUEUE = 30;
	function _deal() {
		_fillQueue();
		var list = queue.splice(0, NUM_THREAD - num_dealing);
		var len = list.length;
		num_dealing += len;
		for (var i = 0; i<len; i++) {
			var conf = list[i];
			Util.img.load(conf.src, {
				fn_cache: function() {
					return conf.cache;
				},
				onload: function(a) {
					console.log('download', a);
					num_dealing--;
					num_downloaded++;

					typeof show_result == 'function' && show_result({
						downloaded: num_downloaded
					});
					setTimeout(_deal, 0);
				}
			});
		}
	}
	var cache = {};
	var url_list = [];
	var url_index = -1;
	function download(url, min_zoom, max_zoom) {
		cache[url] = {
			min: min_zoom,
			max: max_zoom,
			x: 0,
			y: 0,
			z: min_zoom,
			key: Util.md5(url)
		}
	}
	function _getImg(url) {
		var conf = cache[url];
		var z = conf.z,
			x = conf.x,
			y = conf.y;
		var min_zoom = conf.min,
			max_zoom = conf.max;	
		var url_img = null;
		if (z >= min_zoom && z <= max_zoom) {
			var zoom_level = Math.pow(2, z) - 1;
			if (x <= zoom_level && y <= zoom_level) {
				url_img = {
					src: url.replace('{z}', z).replace('{x}', x).replace('{y}', y),
					cache: Util.getCachePath('map', conf.key, z+'', x+'', y+'.png')
				}
			}
			if (y+1 > zoom_level) {
				y = 0;
				x++;
				if (x > zoom_level) {
					x = 0;
					z++;
				}
			} else {
				y++;
			}
			conf.x = x;
			conf.y = y;
			conf.z = z;
		}
		return url_img;
	}
	function _getImgs(url, num) {
		var arr = [];
		for (var i = 0; i<num; i++) {
			var img = _getImg(url);
			if (img) {
				arr.push(img);
			} else {
				break;
			}
		}
		return arr;
	}
	function _fillQueue() {
		url_index = url_index == url_list.length-1? 0: url_index+1;
		var url = url_list[url_index];
		
		var arr = _getImgs(url, NUM_MAX_QUEUE - num_dealing);
		queue = queue.concat(arr);
	}

	var map_conf = require('../js/map_conf');
	var min_zoom = map_conf.zoom_min || 3;
	var max_zoom = map_conf.zoom_max || 11;
	map_conf.maps.forEach(function(conf) {
		download(conf.url, 1, max_zoom);
	});
	for (var i in cache) {
		url_list.push(i);
	}
	_deal();
	// download('https://api.mapbox.com/styles/v1/tonnyzhang/cin5pprd300r1c9mazwc36fdm/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG9ubnl6aGFuZyIsImEiOiI2NmJhMzA0NmFlNmQ4ODZhNjU4MGI1NjRlYWVlZTMyMyJ9.cPEAjBxm7y0auxAuINcPLw', 3, 10);
}()