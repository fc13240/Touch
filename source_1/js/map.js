$(function() {
	W.require.bind(null, ['maps', 'storage'], function(map, storage) {
    	var one = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    		subdomains: 'abc'
    	}),
    	two = L.tileLayer('http://api.tiles.mapbox.com/v4/ludawei.mn69agep/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVkYXdlaSIsImEiOiJldzV1SVIwIn0.-gaUYss5MkQMyem_IOskdA&v=1.1');
    	
    	var map_url = storage.get('map_url');

    	window.one = one;
    	var baseMaps = {
		    "one": one,
		    "two": two
		};
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
    })();
})