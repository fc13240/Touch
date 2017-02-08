$(function() {
	var map;
	var _overlays = [];
    W._getMaps(function(a) {
		map = a;
	});
	var confUrl = 'http://61.4.184.171:8080/weather/rgwst/JsonCatalogue?map=china';

	var conf = {
		airpressure: {
		},
		balltemp: {
		},
		humidity: {
		},
		precipitation1h: {
		},
		rainfall24: {
		},
		rainfall3: {
		},
		rainfall6: {
		},
		visibility: {
		},
		windspeed: {
		}
	}
	var loaded = false;
	var onLoadedFn = null;
	Util.req('http://61.4.184.171:8080/weather/rgwst/JsonCatalogue?map=china', function(err, data) {
		loaded = true;
		if (!err) {
			data = data[0];
			for (var i in data) {
				conf[i].url = data[i];
			}
		}
		onLoadedFn && onLoadedFn(conf);
	});
	function _each(arr, cb) {
    	if (arr && arr.length > 0) {
    		$.each(arr, cb);
    	}
    }
    function _clear() {
    	var tmp;
        while((tmp = _overlays.shift())) {
            map.removeLayer(tmp);
        }
    }
	function _render(data) {
		var date = new Date(data.t);
		$('.box_title_container .time').show();
		$('#time_top').html(date.format('yyyy年MM月dd日'));
		$('#time_bottom').html(date.format('hh:mm'));
		
		var list = data.l;
		_each(list, function(i, d) {
			var c = d.c;
			var color = 'rgba('+(c.join(','))+')';
			var arrPoints = [];
			_each(d.p.split(';'), function(i, p) {
				var arr = p.split(',');
				arrPoints.push([parseFloat(arr[1]), parseFloat(arr[0])]);
			});
			var polygon = L.polygon(arrPoints, {
    			stroke: false,
    			fill: true,
    			fillColor: color,
    			fillOpacity: 0.6
    		}).addTo(map);

    		_overlays.push(polygon);
		});
	}
	window.BPA = {
		init: function(name) {
			_clear();
			var url = conf[name].url;
			Util.req(url, function(err, data) {
				if (!err && data) {
					_render(data);
				}
			})
		},
		clear: _clear,
		getConf: function(cb) {
			if (cb) {
				if (loaded) {
					cb(conf);
				} else {
					onLoadedFn = cb;
				}
			}
			return conf;
		}
	}
})