$(function() {
	var $globe_wrap = $('#globe_wrap');

	var conf_map = Util.map.getConf();

	CESIUM_BASE_URL = './js/we_v2/';
	
	var earth;
	function _each(arr, cb) {
    	if (arr && arr.length > 0) {
    		$.each(arr, cb);
    	}
    }
	function _render(data) {
		var areas = data.areas;
        if (areas) {
        	_each(areas, function(i, v) {
        		var arr = [];
        		_each(v.items, function(ii, point) {
        			arr.push([point.y, point.x]);
        		})

        		WE.polygon(arr, {
        			opacity: 0,
        			weight: 0.00001,
        			fill: true,
        			fillColor: v.c,
        			fillOpacity: 0.6
        		}).addTo(earth);

        		// _overlays.push(polygon);
        	});
        }
	}
	var earth_conf = {
		center: [24.196338959003278, -1.6957170305897358],
		zoom: 2
	};
	window.Globe = {
		init: function() {
			$globe_wrap.show();
			if (!earth) {
				earth = new WE.map('globe_wrap', {
					sky: true
				});
				window.earth = earth;
				WE.tileLayer(conf_map.url, {
					subdomains: conf_map.subdomains
				}).addTo(earth);
			}
			earth.setView(earth_conf.center, earth_conf.zoom);
			// var p = map.getCenter();
			// earth.setView([p.lat, p.lng], 3);

			var conf = Micaps.getConf('aqi_wr');
			if (conf) {
				var url = Util.encryURL(conf.dataurl);
				url = 'http://10.14.85.116/map/test/planetary/data/1.json';
				Util.req(url, function(err, data) {
					// console.log('globe', data);
					_render(data);
					setTimeout(function() {
						var bounds = [[14.33, 72.57], [58, 137]];
						earth.panInsideBounds(bounds);
					}, 100);
				});
			}
			
			// var before = null;
			// requestAnimationFrame(function animate(now) {
	  //           var c = earth.getPosition();
	  //           var elapsed = before? now - before: 0;
	  //           before = now;
	  //           earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
	  //           requestAnimationFrame(animate);
	  //       });
		}, clear: function() {
			$globe_wrap.hide();
		}
	}
})