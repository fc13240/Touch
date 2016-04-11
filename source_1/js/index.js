$(function() {
	var $doc = $(document);
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
	$('.tool_wind').click(Wind.show);
	$('.tool_typhoon').click(function() {
		Typhoon.init();
	});
	$('.tool_radar').click(function() {
		Imgs.init('radar');
	});
	$('.tool_cloud').click(function() {
		Imgs.init('cloud');
	});

	var iscroll = new IScroll('#tool_set_top_wrap', {
		mouseWheel: true, 
		click: true,
		momentum: false,
		snap: 'li'
	});
	$('.tool_arrow_top').click(function() {
		iscroll.prev();
	});
	$('.tool_arrow_bottom').click(function() {
		iscroll.next();
	});
	$('.tool_product_list li').click(function() {
		console.log($(this).html());
	});
	var $mask = $('#mask');
	var paint_can_use = false;
	var show_mask = true;
	var $canvas_brush = $('#canvas_brush');
	var $tool_brush = $('.tool_brush').click(function() {
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
	var $tool_hand = $('.tool_hand').click(function() {
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
	$('.tool_changemap').click(function() {
		$doc.trigger('changemap');
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
			$('#btn_close').bind('click', function(){
				window.close();
			});
		}
	}()
})