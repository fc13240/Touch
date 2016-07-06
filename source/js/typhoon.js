$(function(){
	/*时间格式化*/
	Date.prototype.format = function(format,is_not_second){
		format || (format = 'yyyy-MM-dd hh:mm:ss');
		var o = {
			"M{2}" : this.getMonth()+1, //month
			"d{2}" : this.getDate(),    //day
			"h{2}" : this.getHours(),   //hour
			"m{2}" : this.getMinutes(), //minute
			"q{2}" : Math.floor((this.getMonth()+3)/3),  //quarter
		}
		if(!is_not_second){
			o["s{2}"] = this.getSeconds(); //second
			o["S{2}"] = this.getMilliseconds() //millisecond
		}
		if(/(y{4}|y{2})/.test(format)){
			format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
		} 
		for(var k in o){
			if(new RegExp("("+ k +")").test(format)){
				format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
			}
		}
		
		return format;
	}

	// http://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_default?t=1460511040067&callback=typhoon_jsons_list_default
	// http://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_2300503?t=1460511769078&callback=typhoon_jsons_view_2300503
	var URL_TYPHOON = 'http://typhoon.nmc.cn/weatherservice/typhoon/jsons/';
	var URL_LIST = URL_TYPHOON + 'list_default';
	var cache_typhoon = {};
	var is_debug = false;
	try {
		is_debug = !!require('./conf').debug;
	} catch(e) {
		console.log(e);
	}
	function _formatData(str) {
		if (typeof str == 'string') {
			var m = /^[^(]+\(+([^)]+)\)+/.exec(str);
			if (m) {
				var data = m[1];
				try {
					return $.parseJSON(data);
				} catch(e){}
			}
		}
	}
	function _getTyphoonList(cb, is_active){
		function _getList(list){
			if(is_active){
				list = list.filter(function(v){
					if(is_debug || v.is_active){
						return v;
					}
				});
				if (is_debug) {
					list = list.slice(-6);
				}
			}
			cb(list);
		}
		var val_cache = cache_typhoon[URL_LIST];
		if(val_cache){
			_getList(val_cache);
		}else{
			Util.req.text(URL_LIST, function(err, result){
				// [2301121,"MELOR","茉莉",1527,"1527",null,"名字来源于：马来西亚 意为：一种花","stop"]
				result = _formatData(result);
				var typhoonList = [];
				if (result) {
					typhoonList = result.typhoonList;
				}
				
				var list = [];
				$.each(typhoonList, function(i, v) {
					list.push({
						is_active: v[7] != 'stop',
						index: v[3],
						code: v[0],
						cnName: v[2],
						enName: v[1],
						nameDesc: v[6]
					});
				});
				var cache = {};
				$.each(list, function(i, v){
					var index = v.index;
					var val = cache[index];
					if(val){
						val.push(v);
					}else{
						cache[index] = [v];
					}
				});
				var list_new = [];
				for(var i in cache){
					var val = cache[i];
					if(val.length > 1){
						val.sort(function(a, b){
							return a.index - b.index;
						});
						var flag_active = false;
						var code_list = [];
						$.each(val, function(i_val, v_val){
							if(v_val.is_active){
								flag_active = true;
							}
							code_list.push(v_val.code);
						});
						val[0].is_active = flag_active;
						val[0].code_list = code_list;
						list_new.push(val[0]);
					}else{
						list_new.push(val[0]);
					}
				}

				list_new.sort(function(a, b){
					return a.index - b.index;
				});
				cache_typhoon[URL_LIST] = list_new;
				_getList(list_new);
			});
		}
	}
	function _getDate(YMDHM){
		var m = /^(\d{4})(\d{2})(\d{2})(\d{2})/.exec(YMDHM);
		var date = new Date(m[1]+'-'+m[2]+'-'+m[3]+' '+m[4]+':00');
		date.setHours(date.getHours() + 8);
		return date;
	}
	function _getTyphoonDetail(typhoonCode, cb){
		var key = 'typhoon_'+typhoonCode;
		var val_cache = cache_typhoon[key];
		if(val_cache){
			cb(val_cache);
		}else{
			var deferredArr = [];
			try{
				typhoonCode = typhoonCode.split(',');
			}catch(e){
				typhoonCode = [typhoonCode];
			}
			$.each(typhoonCode, function(i, v){
				deferredArr.push(Util.req.text(URL_TYPHOON + 'view_' + v ));
			});
			$.when.apply($, deferredArr).done(function(){
				var items = [];
				var min_lng = min_lat = Number.MAX_VALUE,
					max_lng = max_lat = -Number.MAX_VALUE;
				function _init(lng, lat){
					lng = parseFloat(lng);
					lat = parseFloat(lat);
					if(lng < min_lng){
						min_lng = lng;
					}
					if(lat < min_lat){
						min_lat = lat;
					}
					if(lng > max_lng){
						max_lng = lng;
					}
					if(lat > max_lat){
						max_lat = lat;
					}
				}
				var result_arr = arguments;
				for(var i = 0, args = deferredArr.length == 1? [arguments]: arguments, j = args.length; i<j; i++){
					var result = args[i][0];
					var data = _formatData(result);
					if (data) {
						var typhoon = data.typhoon;
						if (typhoon) {
							var points = typhoon[8];
							$.each(points, function(i, v) {
								var time = new Date(v[2]);
								time.setHours(time.getHours() + 8);
								var obj = {
									time: time,
									lat: v[5],
									lng: v[4],
									level: v[3],
									wind: v[7],
									yq: v[6],
									move_speed: v[9],
									move_dir: v[8]
								};
								var wind_radius = v[10];
								var wr_7 = wind_radius[0];
								if (wr_7) {
									obj.r7_en = wr_7[1];
									obj.r7_es = wr_7[2];
									obj.r7_ws = wr_7[3];
									obj.r7_wn = wr_7[4];
								}
								var wr_10 = wind_radius[1];
								if (wr_10) {
									obj.r10_en = wr_10[1];
									obj.r10_es = wr_10[2];
									obj.r10_ws = wr_10[3];
									obj.r10_wn = wr_10[4];
								}
								var wr_12 = wind_radius[2];
								if (wr_12) {
									obj.r12_en = wr_12[1];
									obj.r12_es = wr_12[2];
									obj.r12_ws = wr_12[3];
									obj.r12_wn = wr_12[4];
								}

								_init(obj.lng, obj.lat);
								var forecast = [];
								var babj_forecast = v[11];
								if (babj_forecast && (babj_forecast = babj_forecast.BABJ)) {
									$.each(babj_forecast, function(i_f, v_f) {
										forecast.push({
											aging: v_f[0],//预报时效
											lat: v_f[3],
											lng: v_f[2],
											level: v_f[7],
											wind: v_f[5],
											qy: v_f[4]
										});
									});
								}
								obj.forecast = forecast;
								items.push(obj);
							});
						}
					}
				}
				var item_last = items[items.length - 1];
				$.each(item_last.forecast, function(i, v){
					_init(v.lng, v.lat);
				});
				cache_typhoon['bound_'+typhoonCode] = [[max_lat, min_lng], [min_lat, max_lng]];
				cache_typhoon[key] = items;
				cb(items);
			});
		}
	}
	var conf_navigation = {
		19: 0.02,
		18: 0.05,
		17: 0.1,
		16: 0.2,
		15: 0.5,
		14: 1,
		13: 2,
		12: 4,
		11: 10,
		10: 20,
		9: 25,
		8: 50,
		7: 100,
		6: 200,
		5: 500,
		4: 1000,
		3: 2000
	}
	function _getWindRadiu(level, item){
		var zoom = map.getZoom();
		var navigation = conf_navigation[zoom];
    	if(navigation){
    		var pixel_km = navigation/67;
    		var pixel_en = item['r'+level+'_en']/pixel_km,
	    		pixel_es = item['r'+level+'_es']/pixel_km,
	    		pixel_ws = item['r'+level+'_ws']/pixel_km,
	    		pixel_wn = item['r'+level+'_wn']/pixel_km;
	    	if (!pixel_en || !pixel_es || !pixel_ws || !pixel_wn) {
	    		return '';
	    	}
	    	var pixel_top_height = Math.abs(pixel_en - pixel_wn),
	    		pixel_bottom_height = Math.abs(pixel_es - pixel_ws),
	    		pixel_left_width = Math.abs(pixel_wn - pixel_ws),
	    		pixel_right_width = Math.abs(pixel_en - pixel_es);

	    	var line_width = 2;	

			var html = '<div class="wind_radiu level'+level+'">'+
			        '<div class="radiu radiu_en" style="width:'+pixel_en+'px;height:'+pixel_en+'px;"></div>'+
			        '<div class="radiu radiu_es" style="width:'+pixel_es+'px;height:'+pixel_es+'px;"></div>'+
			        '<div class="radiu radiu_wn" style="width:'+pixel_wn+'px;height:'+pixel_wn+'px;"></div>'+
			        '<div class="radiu radiu_ws" style="width:'+pixel_ws+'px;height:'+pixel_ws+'px;"></div>'+
			        '<div class="line line_up" style="height:'+(pixel_top_height+line_width)+'px;margin-top:'+(-Math.max(pixel_en, pixel_wn))+'px"></div>'+
			        '<div class="line line_down" style="height:'+(pixel_bottom_height+line_width)+'px;margin-top:'+(Math.max(pixel_es, pixel_ws) - pixel_bottom_height - line_width)+'px"></div>'+
			        '<div class="line line_left" style="width:'+(pixel_left_width+line_width)+'px;margin-right:'+(Math.max(pixel_wn, pixel_ws) - pixel_left_width - line_width)+'px"></div>'+
			        '<div class="line line_right" style="width:'+(pixel_right_width+line_width)+'px;margin-left:'+(Math.max(pixel_en, pixel_es) - pixel_right_width - line_width)+'px"></div>'+
			    '</div>';
    	}

    	return html;
    }
    var _prev_marker;
	function _addTyphoonPoint(item, html){
		html = html || '';
		var wind_level = item.level;
		var level = 1;
		for (var i = 1, j = LEVEL.length; i <= j; i++) {
			if (LEVEL[i - 1].code == wind_level) {
				level = i;
				break;
			}
		}
		
		var cname = 'wind_level wl_'+level;
		var myIcon = L.divIcon({className: cname, html: html, iconSize: L.point(20, 20)});
		var marker = L.marker([item.lat, item.lng], {icon: myIcon}).addTo(map).on('click', function(){
			if(_prev_marker){
				var options = _prev_marker.options.icon.options;
				options.html = html;
				_prev_marker.setIcon(L.divIcon(options));
				_prev_marker.setZIndexOffset(99999);
			}
			_prev_marker = marker;
			if(item.aging){
				return;
			}
			var options = marker.options.icon.options;
			options.html = html+_getWindRadiu(7, item)+_getWindRadiu(10, item)+_getWindRadiu(12, item);
			var myIcon = L.divIcon(options);
			marker.setIcon(myIcon);
			marker.setZIndexOffset(-99999);
		});
		return marker;
	}
	function _getPropupHtml(text){
		return '<div class="popup"><span></span>'+text+'</div>';
	}
	var overlays_cache = {};
	var run_tt = {},
		run_delay_default = 200,
		run_time_total = 5000;
	function _showTyphoon(code){
		// var code_list = code.split(',');
		// code = code_list[0];
		_getTyphoonDetail(code, function(items){
			var typhoon_info = cache_typhoon[code];
			var bound = cache_typhoon['bound_'+code];
			// var southWest = L.latLng(bound[0][1], bound[0][0]),
			//     northEast = L.latLng(bound[1][1], bound[1][0]),
			//     bounds = L.latLngBounds(southWest, northEast);
			map.fitBounds(bound);  
			var _cache = overlays_cache[code] || (overlays_cache[code] = []);
			function _putCache(overlay){
				if(overlay){
					_cache.push(overlay);
				}
			}
			var current_index = 0,
				len = items.length,
				last_index = len - 1;
			var item_first = items[current_index++];

			var numTotal = len;
			var item_last_forecast = items[last_index].forecast;
			if(item_last_forecast){
				numTotal += item_last_forecast.length;
			}
			var run_delay = Math.min(run_delay_default, Math.ceil(run_time_total/numTotal));
			var marker_typhoon = L.marker([item_first.lat, item_first.lng], {
				icon: L.divIcon({
					className: 'typhoon_icon', 
					html: '<div class="rotate"></div>',
					iconSize: [30, 30],
				})
			});
			marker_typhoon.__items = items;
			marker_typhoon.__typhoon_info = typhoon_info;
			marker_typhoon.on('click', function(){
				var v = marker_typhoon.__typhoon_info;

				var title_chart = (v.cnName||'')+'('+(!v.index? v.enName:'第'+v.index+'号台风'+v.enName)+')';
				_initChart(marker_typhoon.__items, title_chart);
			}).addTo(map);
			_putCache(marker_typhoon);
			_putCache(_addTyphoonPoint(item_first, _getPropupHtml(typhoon_info.cnName||typhoon_info.enName)));
			var is_forcast = false;
			var last_shikuang_point;
			function _run(){
				var item_start = is_forcast && current_index == 0? last_shikuang_point: items[current_index-1],
					item_end = items[current_index];
				if (!item_end) {
					return;
				}
				var option_polyline = {
					color: 'white',
					weight: 2,
					opacity: 1
				};
				if(is_forcast){
					option_polyline.dashArray = [10, 8];
				}
				var p_start = L.latLng(item_start.lat, item_start.lng),
					p_end = L.latLng(item_end.lat, item_end.lng);
				var polyline = L.polyline([p_start, p_end], option_polyline).addTo(map);
				_putCache(polyline);

				_putCache(_addTyphoonPoint(item_end));
				if(!is_forcast){
					marker_typhoon.setLatLng(p_end);
					var options = marker_typhoon.options.icon.options;
					options.html = '<div class="rotate"></div>'+_getPropupHtml(item_end.time.format((typhoon_info.cnName||typhoon_info.enName)+'(MM月dd日hh时)'));
					marker_typhoon.setIcon(L.divIcon(options));

					last_shikuang_point = p_end;
				}
				var is_can_next = false;
				if(current_index < last_index){
					current_index++;
					is_can_next = true;
				}else{
					items = item_end.forecast;
					if(items){
						current_index = 0;
						// items.unshift(item_end);
						last_index = items.length - 1;
						is_forcast = true;
						is_can_next = true;
					}
				}
				if(is_can_next){
					run_tt[code] = setTimeout(_run, run_delay);
				}
			}
			run_tt[code] = setTimeout(_run, run_delay);
		});
	}
	function _removeTyhoon(code){
		var overlays = overlays_cache[code];
		if(overlays){
			clearTimeout(run_tt[code]);
			$.each(overlays, function(i, v){
				map.removeLayer(v);
			});
		}
	}
	function _initListRight(){
		var html_title = '';
		$btn_typhoon_list.find('.btn_typhoon.on').each(function(){
			var code = $(this).data('code');
			var v = cache_typhoon[code];

			html_title += '<li>'+(v.cnName||'')+'('+(!v.index? v.enName:'第'+v.index+'号台风'+v.enName)+')</li>';
		});
		if(html_title){
			$typhoon_list.show();
		}else{
			$typhoon_list.hide();
		}
		$typhoon_list.html(html_title);
	}
	var LEVEL = [{
		val: [10.8, 17.1],
		code: 'TD',
		name: '热带低压',
		color: 'rgba(110,196,186, 0.8)'
	}, {
		val: [17.2, 24.4],
		code: 'TS',
		name: '热带风暴',
		color: 'rgba(239,234,58, 0.8)'
	}, {
		val: [24.5, 32.6],
		code: 'STS',
		name: '强热带风暴',
		color: 'rgba(239,124,27, 0.8)'
	}, {
		val: [32.7, 41.4],
		code: 'TY',
		name: '台风',
		color: 'rgba(231,31,30, 0.8)'
	}, {
		val: [41.5, 50.9],
		code: 'STY',
		name: '强台风',
		color: 'rgba(230,38,135, 0.8)'
	}, {
		val: [51.0, 99],
		code: 'SuperTY',
		name: '超强台风',
		color: 'rgba(126,64,149, 0.8)'
	}];
	var myChart;
	function _initChart(points, typhoon_title){
		if(ecObj){
			myChart && myChart.dispose();
			var xAxisData = [];
			var data = [];
			var last_index = points.length - 1;
			var xLabelData = [];
			$.each(points, function(i, v){
				var xLabel = v.time.format('MM月dd日hh时');
				xLabelData.push(xLabel);
				xAxisData.push(i === 0 || i === last_index? xLabel: ' ');
				data.push(v.wind);
			});
			var mark_index = xAxisData.length - 1, 
				mark_name = xAxisData[mark_index],
				mark_val = data[data.length - 1];
			var point_last = points[points.length-1];
			var forecast = point_last.forecast;
			if(forecast){
				var time = point_last.time;
				var last_index = forecast.length - 1;
				$.each(forecast, function(i, v){
					var d = new Date(time.getTime());
					d.setHours(d.getHours() + v.aging);
					var xLabel = d.format('MM月dd日hh时');
					xLabelData.push(xLabel);
					xAxisData.push(last_index === i? xLabel: '  ');
					data.push(v.wind);
				});
			}
			var wind_min = Math.min.apply(Math, data),
				wind_max = Math.max.apply(Math, data);
			
			var space_arr = [];
			var space_total = 0;
			for(var i = 0, j = LEVEL.length; i<j; i++){
				var item = LEVEL[i];
				var val = item.val;
				var dis = (val[1] || wind_max) - val[0];
				space_total += dis;
				space_arr.push({
					d: dis,
					c: item.color
				});
			}
			var color_arr = [];
			var added_per = 0;
			for(var i = 0, j = space_arr.length; i<j; i++){
				var item = space_arr[i];
				added_per += item.d/space_total;
				color_arr.push([added_per, item.c]);
			}
			$wrap_typhoon_chart.show().css({
				left: '100%'
			}).animate({
				left: '15%'
			}, {
				easing: 'swing'
			});
			$typhoon_name.text(typhoon_title);
			myChart = ecObj.init($typhoon_chart.get(0));
			var WIND_MIN = 10,
				WIND_MAX = Math.max(55, wind_max);
			var val_split = 5;
			var yu = WIND_MAX % val_split;
			if(yu > 0){
				WIND_MAX = WIND_MAX - yu + val_split;
			}
			
            myChart.setOption({
            	color: ['white'],
            	grid: {
            		borderColor: 'rgba(0, 0, 0, 0)'
            	},
			    tooltip : {
			        trigger: 'axis',
			        formatter: function (params,ticket,callback) {
			        	var data = params[0];

			        	return xLabelData[data.dataIndex]+'<br/>'+data.seriesName+':'+data.value+'m/s';
			        }
			    },
			    legend: {
			    	show: false,
			        data:['']
			    },
			    calculable : true,
			    xAxis : {
		            show: 1,
		            boundaryGap : false,
		            data : xAxisData,
		            axisLabel: {
		        		textStyle: {
		        			color: 'white',
		        			fontSize: 16
		        			// fontFamily: '宋体'
		        		}
		        	},
		        	splitLine: {
		        		lineStyle: {
		        			color: 'rgba(255, 255, 255, 0.3)',
		        		}
		        	},
		        	axisLine: {
		        		show: false
		        	}
		        },
			    yAxis : {	
		        	show: 1,
		        	min: WIND_MIN,
		        	max: WIND_MAX,
		        	splitNumber: Math.floor((WIND_MAX - WIND_MIN)/5),
		        	axisLabel: {
		        		textStyle: {
		        			color: 'white',
		        			fontSize: 16
		        		}
		        	},
		        	splitLine: {
		        		lineStyle: {
		        			color: 'rgba(255, 255, 255, 0.3)',
		        		}
		        	},
		        	axisLine: {
		        		show: false
		        	}
			    },
			    series : [
			        {
			            name:'风速',
			            type:'line',
			            smooth: 1,
			            symbolSize: 2,
			            clickable: false,
			            draggable: false,
			            itemStyle: {
			            	normal: {
			            		areaStyle: {
			            			type: 'default',
			            			color: (function (){
			                            var zrColor = require_web('zrender/tool/color');
			                            return zrColor.getLinearGradient(
			                                0, $typhoon_chart.height(), 0, 0,
			                                color_arr
			                                // [[0, '#CC6D35'],[0.5, '#C5C153'], [0.7, '#5FA5A3']]
			                            )
			                        })()
			            		},
			            		lineStyle: {
			            			color: 'rgba(0, 0, 0, 0)'
			            		}
			            	}
			            },
			            data: data,
			         //    markPoint: {
			         //    	data: [{type : 'max', name: '最大值',symbol: 'circle', itemStyle:{normal:{color:'#1d6fb8',label:{position:'top'}}}},]
				        // },
			            markLine: {
			            	itemStyle: {
			            		normal: {
			            			lineStyle: {
			            				type: 'solid',
				            			color: '#1d6fb8'
				            		}
			            		}
			            	},
			            	data: [[
						        {xAxis: mark_index, yAxis: 0},
              					{xAxis: mark_index, yAxis: mark_val - 1}           // 当xAxis为类目轴时，字符串'周三'会被理解为与类目轴的文本进行匹配
						    ]]
			            }
			        }
			    ]
            });
		}
	}
	function _initBtns(list){
		var html = '';
		$.each(list, function(i, v){
			cache_typhoon[v.code_list || v.code] = v;
			html += '<div class="box btn_typhoon" data-code="'+(v.code_list || v.code)+'">'+(v.cnName||v.enName)+'</div>';
		});
		$btn_typhoon_list.html(html);
	}
	var $btn_typhoon_list,
		$typhoon_list,
		$typhoon_name;
	var $wrap_typhoon_chart,
		$typhoon_chart;
	var $wrap_typhoon;
	// 绑定事件
	$(function(){
		$wrap_typhoon = $('#wrap_typhoon');
		$wrap_typhoon_chart = $('.wrap_typhoon_chart'),
		$typhoon_chart = $('#typhoon_chart');
		$typhoon_name = $wrap_typhoon_chart.find('.typhoon_name');
		$btn_typhoon_list = $('.btn_typhoon_list').delegate('.btn_typhoon', 'click', function(e){
			e.stopPropagation();
			var $this = $(this);
			var code = $this.data('code');
			if($this.hasClass('on')){
				$this.removeClass('on');
				_removeTyhoon(code);
			}else{
				$this.addClass('on');
				_showTyphoon(code);
			}

			_initListRight();
			$btn_close_typhoon_chart.click();
		});
		$typhoon_list = $('.typhoon_list').html('');
		var $btn_close_typhoon_chart = $('#btn_close_typhoon_chart').click(function(){
			$(this).parent().hide();
		});
		// Util.req.textScript('./js/echarts.js', function(){
			require_web.config({
		        paths: {
		            echarts: './js/'
		        }
		    });
			require_web([
	            'echarts',
	            'echarts/chart/line',
	        ], function (ec) {
	        	ecObj = ec;
	        });
		// });
		var fn = function(e){
			if(e.preventDefault){
				e.preventDefault();
			}else{
				window.event.returnValue = false;
			}
		}
		// $wrap_typhoon_chart.bind('touchstart', fn);
		$wrap_typhoon_chart.bind('touchmove', fn);
		// $wrap_typhoon_chart.bind('touchend', fn);
	});	

	var map;
	W.require.bind(null, ['maps'], function(maps) {
    	map = maps;
		map.on('zoomstart', function(){
			if(_prev_marker){
				var option = _prev_marker.options.icon.options;
				option.html = '';
				_prev_marker.setIcon(L.divIcon(option));
			}
		});
    })();
    var GuardLine = (function() {
    	var _overlays = [];
    	var _group;
    	return {
    		show: function() {
    			var guardLine_24 = [[34.005024,126.993568],[21.971252,126.993568],[17.965860,118.995521],[10.971050,118.995521],[4.486270,113.018959],[-0.035506,104.998939]];
		        var guardLine_48 = [[-0.035506,104.998939],[-0.035506,119.962318],[14.968860,131.981361],[33.959474,131.981361]];
		        var line24 = L.polyline(guardLine_24, {color: '#FF0', weight: 1, opacity: 1, id: 'gl_24'});//#F8E406
		        var line48 = L.polyline(guardLine_48, {color: '#FF0', weight: 1, opacity: 1, dashArray: '5 5', id: 'gl_48'});
		        var myIcon1 = L.divIcon({className: 'guardLine_24', html: '24小时警戒线', iconSize: L.point(20, 20)});
		        var marker1 = L.marker([34.005024,126.993568], {icon: myIcon1});
		        var myIcon2 = L.divIcon({className: 'guardLine_48', html: '48小时警戒线', iconSize: L.point(20, 20)});
		        var marker2 = L.marker([33.959474,131.981361], {icon: myIcon2});

		        _group = L.layerGroup([line24, line48, marker1, marker2]).addTo(map);
    		},
    		clear: function() {
    			_group && map.removeLayer(_group);
    			_group = null;
    		}
    	}
    })();
    function guardLine() {
        

        return [line24, marker1, marker2]
    }
	window.Typhoon = {
		init: function() {
			$wrap_typhoon.show();
			_getTyphoonList(function(typhoonList){
				if(typhoonList.length > 0){
					_initBtns(typhoonList);
				}else{
					$typhoon_list.html('<li>当前无台风</li>');
				}
			}, true);
			GuardLine.show();
		},
		clear: function() {
			$wrap_typhoon.hide();
			$wrap_typhoon_chart.hide();
			var cache_list = cache_typhoon[URL_LIST];
			if(cache_list){
				for(var i = 0, j = cache_list.length; i<j; i++){
					_removeTyhoon(cache_list[i].code);
				}
			}
			GuardLine.clear();
		}
	}
})