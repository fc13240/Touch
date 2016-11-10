$(function() {
	var electron = require('electron');
	var toolConsole = require('./js/console/tool');
	if (IS_BIG_SCREEN) {
		$('body').addClass('big_screen');
	}
	var WIN_HEIGHT = $(window).height();
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
	
	(function() {
		setTimeout(function() {
			function _check() {
				var result = Util.verification.get();
				if (!result || !result.f) {
					alert('软件试用已经结束，请联系相关管理员！');

					return electron.ipcRenderer.send('open.console', {
						tab: 'licence'
					});
				}

				setTimeout(_check, 1000 * 60 * 60);
			}

			_check();
		}, 1000);
	})();
	var Wind = (function() {
		var windAnimation;
		W.require.bind(null, ['animation'], function(animation) {
	    	windAnimation = animation;
	    	windAnimation && windAnimation.stop();
	    })();
		return {
			show: function() {
				IS_SHOW_WIND = true;
				_getCanvasWind().show();
				windAnimation && windAnimation.run();
			},
			hide: function() {
				IS_SHOW_WIND = false;
				_getCanvasWind().hide();

				windAnimation && windAnimation.stop();
			}
		}
	})();
	var CONF_MENU = [{
		name: '实况监测',
		img: 'b_sk',
		sub: [{
			name: '卫星云图',
			title: '中国区域卫星云图',
			img: 'cloud',
			click: function() {
				Imgs.init('cloud');
			}
		}, {
			name: '雷达图',
			title: '全国雷达拼图',
			img: 'radar',
			click: function() {
				Imgs.init('radar');
			}
		}, {
			name: '风场+台风',
			title: '地面流场及台风路径',
			img: 'wind_typhoon',
			click: function() {
				Wind.show();
				Typhoon.init();
			}
		}, {
			name: '风场',
			title: '流场示意图',
			img: 'wind',
			click: Wind.show
		}, {
			name: '台风',
			title: '实时台风路径',
			img: 'typhoon',
			click: Typhoon.init
		}, {
			name: '空气质量',
			title: '全国实时空气质量',
			img: 'aqi',
			click: function() {
				Micaps.init('aqi');
			}
		}, {
			name: '天气统计',
			title: '实时天气统计',
			img: 'tongji',
			click: function() {
				Micaps.init('tongji');
			}
		}, {
			name: '实景天气',
			img: 'camera',
			click: function() {
				Camera.init();
			}
		},]
	}, {
		name: '天气预报',
		img: 'b_yb',
		sub: [{
			name: '未来三天降水量预报',
			img: 'rain',
			sub: [{
				name: '24h',
				click: function() {
					Micaps.init('rain3d_24');
				}
			}, {
				name: '48h',
				click: function() {
					Micaps.init('rain3d_48');
				}
			}, {
				name: '72h',
				click: function() {
					Micaps.init('rain3d_72');
				}
			}]
		}, {
			name: '全国雾区预报',
			img: 'fog',
			click: function() {
				Micaps.init('fog');
			}
		}, {
			name: '全国霾区预报',
			img: 'haze',
			click: function() {
				Micaps.init('haze');
			}
		}, {
			name: '空气污染扩散气象条件',
			img: 'air_pollute',
			click: function() {
				Micaps.init('aqi_wr');
			}
		}]
	}, {
		name: '灾害预警',
		img: 'b_yj',
		sub: [{
			name: '气象灾害预警',
			img: 'alarm',
			title: '全国气象灾害预警',
			click: function() {
				Alarm.init();
			}
		}]
	}, {
		name: '形势分析',
		img: 'b_xsc',
		sub: [{
			name: '亚欧地面场分析',
			img: 'tqfx',
			click: function() {
				Micaps.init('xsc');
			}
		}]
	}, {
		name: '外来产品',
		img: 'b_wlzy',
		sub: [{
			name: '3d效果展示',
			img: '3d',
			click: function() {
				Terrain.init();
			}
		}]
	}];

	var MENU = [];

	var $box_title_container = $('.box_title_container'),
		$title_time = $box_title_container.find('.time'),
		$product_name = $box_title_container.find('.product_name');
	var $tool_product_list = $('.tool_product_list');
	var $tool_tip = $('.tool_tip');

	function initMenu() {
		var cache = {};
		$.each(CONF_MENU, function(i, v) {
			var id = v.name;
			cache[id] = v;
			var sub = v.sub;
			if (sub && sub.length > 0) {
				$.each(sub, function(ii, vv) {
					cache[id + '_' + vv.name] = vv;
				});
			}
		});
		var menu = toolConsole.getMenuFront();
		var menuNew = [];
		$.each(menu, function(i, v) {
			var val = cache[v.id];
			if (val) {
				var subNew = [];
				var sub = v.sub;
				if (sub && sub.length > 0) {
					$.each(sub, function(ii, vv) {
						var subVal = cache[vv.id];
						if (subVal) {
							subNew.push(subVal);
						}
					});
				}
				val.sub = subNew;
				menuNew.push(val);
			}
		});

		MENU = menuNew;
		var html_product_list = '';
		$.each(menuNew, function(i, v) {
			var html = '<span>'+v.name+'</span>';
			var img = v.img;
			if (img !== undefined) {
				html = '<img src="./img/product/'+img+'.png"/>';
			}
			html += '<ul>';
			var sub = v.sub;
			$.each(sub, function(i_sub, v_sub) {
				html += '<li><img src="./img/product/'+v_sub.img+'.png"/></li>';
			});
			html += '</ul>';
			html_product_list += '<li data-tip="'+v.name+'" class="p_big">'+html+'</li>';
		});
		$tool_product_list.html(html_product_list);


		$tool_product_list.find('ul').each(function() {
			var $this = $(this);
			var h = $this.height();
			if (h > WIN_HEIGHT / 2) {
				$this.addClass('pos_middle').css('top', WIN_HEIGHT/2-$this.parent().offset().top - h/2);
			}
		});
	}
	initMenu();

	BPA.getConf(function(confBPA) {
		var sub = CONF_MENU[0].sub;
		var conf = [{
			type: 'rain',
			name: '降水',
			img: 'rain',
			sub: [
				{
					type: 'precipitation1h',
					name: '1小时'
				}, {
					type: 'rainfall3',
					name: '3小时'
				}, {
					type: 'rainfall6',
					name: '6小时'
				}, {
					type: 'rainfall24',
					name: '24小时'
				}
			]
		}, {
			type: 'airpressure',
			img: 'airpressure',
			name: '气压'
		}, {
			type: 'balltemp',
			img: 'temperature',
			name: '温度'
		}, {
			type: 'humidity',
			img: 'humidity',
			name: '相对湿度'
		}, {
			type: 'visibility',
			img: 'visibility',
			name: '能见度'
		}, {
			type: 'windspeed',
			img: 'windspeed',
			name: '风速'
		}];
		conf[0].sub.forEach(function(d) {
			var type = d.type;
			d.click = function() {
				BPA.init(type)
			}
		});
		conf.forEach(function(d) {
			d.img = d.img || '3d';
			if (d.type != 'rain') {
				d.click = function() {
					BPA.init(d.type)
				}
			}
			sub.push(d);
		});
		initMenu();
	});
	$doc.on('click', function() {
		$tool_tip.hide();
	});

	var $sub_wrap = $('.p_big ul');
	$tool_product_list.delegate('li.p_big', 'click', function() {
		var $this = $(this);
		$this.removeClass('sub_on').addClass('on').siblings().removeClass('on').find('.on').removeClass('on');
	});
	var $tool_sub_list = $('.tool_sub_list');
	$tool_sub_list.delegate('li', 'click', function(e) {
		var $this = $(this);
		$this.addClass('on').siblings().removeClass('on');
		var index_a = $this.data('a'),
			index_b = $this.data('b'),
			index_c = $this.data('c');

		try {
			var item = MENU[index_a].sub[index_b].sub[index_c];
		} catch(e){}
		if (item) {
			var fn = item.click;
			fn && fn();
		}
	});
	$tool_product_list.delegate('.p_big ul li', 'click', function(e) {
		e.stopPropagation();
		var $this = $(this);
		// $this.parent().hide();
		$this.closest('.p_big').addClass('sub_on');
		Util.Loading.hide();
		
		Wind.hide();
		BPA.clear();
		Typhoon.clear();
		Imgs.clear();
		Paint.clear();
		Camera.clear();
		Micaps.clear();
		Alarm.clear();
		// Globe.clear();
		Terrain.clear();

		$box_title_container.hide();
		$title_time.hide();
		$product_name.hide();

		$('.load_progress_wrap').hide();
		$this.addClass('on').siblings().removeClass('on');

		var name = $(this).data('name');

		var legend = CONF_LEGENDNAME[name];
		if (legend) {
			$legend.show().find('img').attr('src', legend);
		} else {
			$legend.hide();
		}


		$tool_sub_list.html('');
		var index_big = $this.closest('.p_big').index();
		var index = $this.index();
		var conf = MENU[index_big].sub[index];
		if (conf) {
			var title = conf.title || conf.name;
			if (title) {
				$box_title_container.show();
				$product_name.text(title).show();
			}
			var fn = conf.click;
			if (fn) {
				fn();
			}
			var sub = conf.sub;
			if (sub) {
				var html_sub = '';
				$.each(sub, function(i, v) {
					html_sub += '<li class="box" data-a='+index_big+' data-b="'+index+'" data-c="'+i+'">'+v.name+'</li>';
				});
				$tool_sub_list.html(html_sub);

				$tool_sub_list.find('li:first').click();
			}
		}
	});
	// .on('mouseenter', function() {
	// 	var $this = $(this);
	// 	$tool_tip.text($this.data('tip')).css({
	// 		top: $this.position().top + $this.height() / 2 + $('#tool_set_top_wrap').position().top - 15
	// 	}).fadeIn();
	// }).on('mouseleave', function() {
	// 	$tool_tip.hide();
	// });

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
	

	// var iscroll = new IScroll('#tool_set_top_wrap', {
	// 	mouseWheel: true, 
	// 	click: true,
	// 	momentum: false,
	// 	snap: 'li'
	// });
	// $('.tool_arrow_top').click(function() {
	// 	iscroll.prev();
	// });
	// $('.tool_arrow_bottom').click(function() {
	// 	iscroll.next();
	// });
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
			$('#btn_console').on('click', function() {
				electron.ipcRenderer.send('open.console');
			});
			require(require('path').join(__dirname, './js/reporter'));
			setTimeout(function() {
				electron.remote.getCurrentWindow().show();
			}, 1000);
		}
	}();
})