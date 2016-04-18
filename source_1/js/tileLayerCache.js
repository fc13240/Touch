/**
 * 主要对leaflet的瓦片进行请求时缓存
 */
!function() {
    if (!is_native) {
        return;
    }
	var fs = require('fs');
	var path = require('path');
	var crypto = require('crypto');
	var os = require('os');

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
	function saveBase64(save_file_name, img_data){
		img_data = img_data.substring(img_data.indexOf('base64,') + 7);
		img_data = new Buffer(img_data, 'base64');

		mkdirSync(path.dirname(save_file_name));
		fs.writeFileSync(save_file_name, img_data);

		return img_data;
	}
	var saveImg = (function() {
		var canvas = L.DomUtil.create("canvas");
		var cxt = canvas.getContext('2d');
		return function(savepath, img, fn, is_return_data) {
			canvas.width = img.width;
			canvas.height = img.height;
			cxt.drawImage(img, 0, 0);
			var dataURL = canvas.toDataURL('image/png');

			var data = saveBase64(savepath, dataURL);
			fn && fn (is_return_data?data: dataURL);
		}
	})();
	var DEFAULT_PRIVATE_KEY = 'cwtv'
	var encrypt = function(str, key){
		if(str && str.toString){
			return crypto.createHash('sha1').update(str.toString() + (key||DEFAULT_PRIVATE_KEY)).digest('hex');
		}
		return '';
	}
	function _getCachePath(url, option) {
		var key = encrypt(url);
		var src = path.join(os.tmpDir(), 'cwtv', 'map', key, option.z+'', option.x+'', option.y+'.png');
		
		return src;
	}
	L.TileLayer.Multi.include({
		getTileUrl: function(a) {
			var b = this._getZoomForUrl(),
				c = this._tileDefs[b];
			this._adjustTilePoint(a);
			var option = L.extend({
				s: this._getSubdomain(a, c.subdomains),
				z: b,
				x: a.x,
				y: a.y
			}, this.options);
			var _cachePath = _getCachePath(c.url, option);
			if (fs.existsSync(_cachePath)) {
				console.log('_cachePath = ', _cachePath);
				return _cachePath;
			} else {
				var url = L.Util.template(c.url, option);
				return url;
			}
		},
		_loadTile: function(a, b) {
			var _this = this;
			a._layer = this;
			a.onerror = this._tileOnError;
			_this._adjustTilePoint(b);
			var src = _this.getTileUrl(b);

			var z = _this._getZoomForUrl(),
				c = _this._tileDefs[z];
			_this._adjustTilePoint(b);
			var option = L.extend({
				s: _this._getSubdomain(b, c.subdomains),
				z: z,
				x: b.x,
				y: b.y
			}, _this.options);

			_getImg(src, c.url, option, function(_cachePath) {
				a.src = _cachePath;
				_this._tileOnLoad.apply(a);
			});
			_this.fire("tileloadstart", {
				tile: a,
				url: src
			})
		}
	});

	function _getImg(src, url, option, onload) {
		var src_return = src;
		var img = new Image();
		var is_net = /^http/.test(src);
		var is_cache = false;
		if (is_net) {
			var _cachePath = _getCachePath(url, option);
			if (fs.existsSync(_cachePath)) {
				src_return = src = _cachePath;
				is_cache = true;
				console.log('_cachePath = ', _cachePath);
			}
		}
		
		img.onload = function() {
			if (is_net && !is_cache) {
				console.log('loadimage = ', src);
				saveImg(_cachePath, img);
				// src_return = _cachePath;
			}
			onload && onload.call(this, src_return);
		}
		img.crossOrigin = '';
		img.src = src;
		return src_return;
	}

	Util.TileLayer = {
		// 为3D地图添加瓦片缓存机制
		cache: function(TileMapServiceImageryProvider, Aa) {
			// var fn_requestImage = TileMapServiceImageryProvider.prototype.requestImage;
			TileMapServiceImageryProvider.prototype.requestImage = function(a, b, c) {
				var x = a, y = b, z = c;
				if (c < this.minimumLevel || c > this.maximumLevel) return this.sb;
				var d = this.url.replace("{z}", c.toFixed(0)),
					d = d.replace("{x}", a.toFixed(0)),
					d = d.replace("{y}", (this.Lc ? (1 << c) - b - 1 : b).toFixed(0));

				var sub = this.Sb[Aa(a + b + c, this.Sb.length)];
				0 < this.Sb.length && (d = d.replace("{sub}", sub));
				a = this.Ja ? this.Ja.getURL(d) : d;
				// var fn = Cesium.ImageryProvider.loadImage(this, a)
				// console.log(fn);
				

				var def = $.Deferred();
				_getImg(a, this.url.replace('{sub}', '{s}'), {
					s: sub,
					x: x,
					y: y,
					z: z
				}, function(_cachePath) {
					def.resolve(this);
				});

				return def;
			}
		}
	}
}()