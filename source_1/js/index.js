$(function() {
	W.define('text', ['maps'], function(maps) {
		var LNGLAT_PROVINCE = {
			"新疆": [87.606117,43.790939],
			"西藏": [91.13205,29.657589],
			"内蒙古": [111.6633,40.820942],
			"青海": [101.787453,36.609447],
			"四川": [104.081757,30.661057],
			"黑龙江": [126.643341,45.741493],
			"甘肃": [103.750053,36.068039],
			"云南": [102.704567,25.043844],
			"广西": [108.311768,22.806543],
			"湖南": [112.98127,28.200825],
			"陕西": [108.949028,34.261684],
			"广东": [113.261429,23.118912],
			"吉林": [125.31543,43.892563],
			"河北": [114.489777,38.045128],
			"湖北": [114.291939,30.567514],
			"贵州": [106.711372,26.576874],
			"山东": [117.0056,36.667072],
			"江西": [115.899918,28.675991],
			"河南": [113.650047,34.757034],
			"辽宁": [123.411682,41.796616],
			"山西": [112.569351,37.871113],
			"安徽": [117.275703,31.863255],
			"福建": [119.297813,26.07859],
			"浙江": [120.159248,30.265995],
			"江苏": [118.772781,32.047615],
			"重庆": [106.510338,29.558176],
			"宁夏": [106.271942,38.46801],
			"海南": [110.346512,20.031794],
			"台湾": [121.514282,25.049128],
			"北京": [116.380943,39.923615],
			"天津": [117.203499,39.131119],
			"上海": [121.469269,31.238176],
			"香港": [114.154404,22.280685],
			"澳门": [113.550056,22.200796]
		};

		var markers = [];
		function addProvinceName(level){
			var tmp;
			while((tmp = markers.shift())){
				maps.removeLayer(tmp);
			}
			for(var i in LNGLAT_PROVINCE){
				var val = LNGLAT_PROVINCE[i];
				var myIcon = L.divIcon({className: 'map_label level_'+maps.getZoom(), html: '<span>'+i+'</span>'});
				var marker = L.marker([val[1], val[0]], {icon: myIcon}).addTo(maps);
				markers.push(marker);
			}
		}
		addProvinceName();
		maps.on('zoomend', function(e){
			addProvinceName();
		});
	});
	$(window).on('load', W.require.bind(null, ['typhoon','imgs', 'text'], function() {}));
	var _getCanvasWind = (function() {
		var $canvasWind;
		return function() {
			if (!$canvasWind || $canvasWind.length == 0) {
				$canvasWind = $('.leaflet-canvas1, .leaflet-canvas2, .leaflet-canvas3');
			}
			return $canvasWind;
		}
	})();
	var Wind = {
		show: function() {
			_getCanvasWind().show();
		},
		hide: function() {
			_getCanvasWind().hide();
		}
	}
	var CONF_LEGENDNAME = {
		wind: './img/legend_wind.png',
		radar: './img/legend_radar.png',
		typhoon: './img/legend_typhoon.png'
	};
	var title_url_pre = './img/title_';
	var CONF_TITLE = {
		wind: title_url_pre + 'wind.png',
		radar: title_url_pre + 'radar.png',
		cloud: title_url_pre + 'cloud.png',
		typhoon: ''
	}
	var $box_title_container = $('.box_title_container');
	var $legend = $('.legend');
	// 清除所有操作
	$('.tool_btn_pro').click(function() {
		Wind.hide();
		Typhoon.clear();
		Imgs.remove();
		Paint.clear();
		$('.load_progress_wrap').hide();
		$(this).addClass('on').siblings().removeClass('on');

		var name = $(this).data('name');
		var title_img = CONF_TITLE[name];
		if (title_img) {
			$box_title_container.show();
			$box_title_container.find('img').attr('src', title_img);
		} else {
			$box_title_container.hide();
		}
		$box_title_container.find('.time').hide();

		var legend = CONF_LEGENDNAME[name];
		if (legend) {
			$legend.show().find('img').attr('src', legend);
		} else {
			$legend.hide();
		}
	});
	var $box_tool = $('.box_tool');
	// 风场按钮
	$box_tool.find('.tool_wind').click(Wind.show);
	$box_tool.find('.tool_typhoon').click(function() {
		Typhoon.init();
	});
	$box_tool.find('.tool_radar').click(function() {
		Imgs.init('radar');
	});
	$box_tool.find('.tool_cloud').click(function() {
		Imgs.init('cloud');
	});

	var $mask = $('#mask');
	var paint_can_use = false;
	var show_mask = true;
	var $canvas_brush = $('#canvas_brush');
	var $tool_brush = $box_tool.find('.tool_brush').click(function() {
		$(this).toggleClass('on');
		if(paint_can_use){
			Paint.clear();
			$canvas_brush.hide();
		}else{
			$tool_hand.removeClass('on');
			show_mask = true;
			$canvas_brush.show();
			$mask.show();
			Paint.init($canvas_brush.get(0));
		}
		
		paint_can_use = !paint_can_use;
	});
	var $tool_hand = $box_tool.find('.tool_hand').click(function() {
		if (show_mask) {
			$mask.hide();
		} else {
			$mask.show();
		}
		$(this).toggleClass('on');
		show_mask = !show_mask;
		if(paint_can_use){
			$tool_brush.click();
		}
	});

	!function(){
		var win = window;
		var resizeTT;
		// 重置画布
		function resizeBrush(){
			clearTimeout(resizeTT);
			resizeTT = setTimeout(function(){
				$canvas_brush.attr('width', win.innerWidth).attr('height', win.innerHeight);
			}, 10);
		}
		$(win).bind('resize', resizeBrush);
		resizeBrush();
	}();
	!function(){
		var fn = function(e){
			paint.preventDefault(e);
		}
		$mask.bind('touchstart', fn);
		$mask.bind('touchmove', fn);
		$mask.bind('touchend', fn);
	}();
	!function(){
		if(is_native){
			var _win_current = nwDispatcher.requireNwGui().Window.get();
			$('#btn_close').bind('click', function(){
				_win_current.close();
			});
		}
	}()
})