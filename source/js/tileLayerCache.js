/**
 * 主要对leaflet的瓦片进行请求时缓存
 */
!function() {
    if (!is_native) {
        return;
    }

	var fs = require('fs');
	function _getCachePath(url, option) {
		var key = Util.md5(url);
		return Util.getCachePath('map', key, option.z+'', option.x+'', option.y+'.png');
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
				Util.log('_cachePath = ', _cachePath);
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

			Util.img.load(src, {
				fn_cache: function() {
					return _getCachePath(c.url, option)
				},
				onload: function(_cachePath) {
					a.src = _cachePath;
					_this._tileOnLoad.apply(a);
				}
			});
			_this.fire("tileloadstart", {
				tile: a,
				url: src
			})
		}
	});
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