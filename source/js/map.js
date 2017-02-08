$(function() {
	W.require({
		dependencies:['maps', 'storage'], 
		callback: function(map, storage) {
			var baseMaps = {};
			var map_conf = require('./js/map_conf');
			if (map_conf) {
				$.each(map_conf.maps, function(i, conf) {
					baseMaps[i] = L.tileLayer(conf.url, {
						subdomains: conf.subdomains || ''
					});
				})
			}
			Util.map = {
				getConf: function() {
					var conf = storage.get('_map_conf');
					if (!conf) {
						var first_conf = map_conf.maps[0]
						conf = {
							url: first_conf.url,
							subdomains: first_conf.subdomains || ''
						}
					}
					return conf;
				}
			}

			L.control.layers(baseMaps).addTo(map);

			var $map_types = $('.leaflet-control-layers-selector');
			var len = $map_types.length;
			var current_index = 0;
			var conf = storage.get('_map_conf');
			if (conf) {
				var url = conf.url;
				$map_types.each(function(i) {
					var key = $(this).next().text().trim();
					var c = baseMaps[key];
					if (c && c._url == url) {
						current_index = i;
					}
				});
			}
			$(document).on('changemap', function() {
				var next_index = current_index+1;
				if (next_index >= len) {
					next_index = 0;
				}
				var $item = $map_types.eq(next_index).click();
				current_index = next_index;

				var key = $item.next().text().trim();

				var conf = baseMaps[key];
				if (conf) {
					storage.put('_map_conf', {
						url: conf._url,
						subdomains: conf.options.subdomains
					});
				}
			});
		}
	});
})