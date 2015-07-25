!function(angular){
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
	angular.module('services', []).service('typhoon', ["$rootScope", "maps", function(rootScope, map){
		var URL_TYPHOON = 'http://typhoon.weather.gov.cn/Typhoon/data/';
		var URL_LIST = URL_TYPHOON + 'typhoonList.xml';
		var cache_typhoon = {};
		function _getTyphoonList(cb, is_active){
			function _getList(list){
				if(is_active){
					list = list.filter(function(v){
						if(v.is_active){
							return v;
						}
					});
				}
				cb(list);
			}
			var val_cache = cache_typhoon[URL_LIST];
			if(val_cache){
				_getList(val_cache);
			}else{
				$.get(URL_LIST, function(result){
					var list = [];
					$(result).find('typhoon').each(function(){
						var $this = $(this);
						var m_code = /(\d{2})$/.exec($this.attr('interCode'));
						list.push({
							is_active: !!$this.attr('year'),
							index: m_code[1],
							code: $this.attr('xuHao'),
							cnName: $this.attr('chnName'),
							enName: $this.attr('enName'),
						});
					});
					list.sort(function(a, b){
						return a.code.localeCompare(b.code)
					});
					cache_typhoon[URL_LIST] = list;
					_getList(list);
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
			var url = URL_TYPHOON + typhoonCode + '.xml';
			var val_cache = cache_typhoon[url];
			if(val_cache){
				cb(val_cache);
			}else{
				$.get(url, function(result){
					var items = [];
					$(result).find('key').each(function(){
						var $this = $(this);
						var obj = {
							time: _getDate($this.attr('YMDHM')),
							lat: $this.attr('V05'),
							lng: $this.attr('V06'),
							level: $this.attr('V07'),
							wind: $this.attr('V08'),
							qy: $this.attr('V09'),
							move_speed: $this.attr('V11'),
							move_dir: $this.attr('V12'),
							r7: $this.attr('V21'),
							r10: $this.attr('V22'),
							r7_en: $this.attr('V71'),
							r7_es: $this.attr('V72'),
							r7_wn: $this.attr('V73'),
							r7_ws: $this.attr('V74'),
							r10_en: $this.attr('V101'),
							r10_es: $this.attr('V102'),
							r10_wn: $this.attr('V103'),
							r10_ws: $this.attr('V104'),
							r12_en: $this.attr('V121'),
							r12_es: $this.attr('V122'),
							r12_wn: $this.attr('V123'),
							r12_ws: $this.attr('V124'),
						};
						var forecast = [];
						$this.find('ele').each(function(){
							var $ele = $(this);
							forecast.push({
								aging: parseInt($ele.attr('V04')),//预报时效
								lat: $ele.attr('V05'),
								lng: $ele.attr('V06'),
								level: $ele.attr('V07'),
								wind: $ele.attr('V08'),
								qy: $ele.attr('V09')
							});
						});
						obj.forecast = forecast;
						items.push(obj);
					});
					cache_typhoon[url] = items;
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
		    	var pixel_top_height = Math.abs(pixel_en - pixel_wn),
		    		pixel_bottom_height = Math.abs(pixel_es - pixel_ws),
		    		pixel_left_width = Math.abs(pixel_wn - pixel_ws),
		    		pixel_right_width = Math.abs(pixel_en - pixel_es);


				var html = '<div class="wind_radiu level'+level+'">'+
				        '<div class="radiu radiu_en" style="width:'+pixel_en+'px;height:'+pixel_en+'px;"></div>'+
				        '<div class="radiu radiu_es" style="width:'+pixel_es+'px;height:'+pixel_es+'px;"></div>'+
				        '<div class="radiu radiu_wn" style="width:'+pixel_wn+'px;height:'+pixel_wn+'px;"></div>'+
				        '<div class="radiu radiu_ws" style="width:'+pixel_ws+'px;height:'+pixel_ws+'px;"></div>'+
				        '<div class="line line_up" style="height:'+pixel_top_height+'px;margin-top:'+(-Math.max(pixel_en, pixel_wn))+'px"></div>'+
				        '<div class="line line_down" style="height:'+pixel_bottom_height+'px;margin-top:'+(Math.max(pixel_es, pixel_ws) - pixel_bottom_height)+'px"></div>'+
				        '<div class="line line_left" style="width:'+pixel_left_width+'px;margin-right:'+(Math.max(pixel_wn, pixel_ws) - pixel_left_width)+'px"></div>'+
				        '<div class="line line_right" style="width:'+pixel_right_width+'px;margin-left:'+(Math.max(pixel_en, pixel_es) - pixel_right_width)+'px"></div>'+
				    '</div>';
	    	}

	    	return html;
	    }
	    var _prev_marker;
		function _addTyphoonPoint(item, html){
			html = html || '';
			var wind = item.level;
			var level = 1;
			if(wind <= 7){
				level = 1
			}else if(wind > 7 && wind <= 9){
				level = 2;
			}else if(wind > 9 && wind <= 1){
				level = 3;
			}else if(wind > 11 && wind <= 13){
				level = 4;
			}else if(wind > 13 && wind <= 15){
				level = 5;
			}else if(wind > 15 && wind <= 17){
				level = 6;
			}
			
			var cname = 'wind_level wl_'+level;
			var myIcon = L.divIcon({className: cname, html: html});
			var marker = L.marker([item.lat, item.lng], {icon: myIcon}).addTo(map).on('click', function(){
				if(_prev_marker){
					var cn = _prev_marker.options.icon.options.className;
					_prev_marker.setIcon(L.divIcon({className: cn, html: html}));
				}
				_prev_marker = marker;
				if(item.aging){
					return;
				}
				var myIcon = L.divIcon({className: cname, html: html+_getWindRadiu(7, item)+_getWindRadiu(10, item)});
				marker.setIcon(myIcon);
				marker.setZIndexOffset(-100);
			});
			return marker;
		}
		map.on('zoomstart', function(){
			if(_prev_marker){
				var cn = _prev_marker.options.icon.options.className;
				_prev_marker.setIcon(L.divIcon({className: cn, html: ''}));
			}
		});
		function _getPropupHtml(text){
			return '<div class="popup"><span></span>'+text+'</div>';
		}
		var overlays_cache = {};
		var run_tt = {},
			run_delay = 300;
		function _showTyphoon(code){
			_getTyphoonDetail(code, function(items){
				var typhoon_info = cache_typhoon[code];
				var _cache = overlays_cache[code] || (overlays_cache[code] = []);
				function _putCache(overlay){
					if(overlay){
						_cache.push(overlay);
					}
				}
				var current_index = 0,
					last_index = items.length - 1;
				var item_first = items[current_index++];

				var marker_typhoon = L.marker([item_first.lat, item_first.lng], {
					icon: L.divIcon({
						className: 'typhoon_icon', 
						html: '<div class="rotate"></div>',
						iconSize: [30, 30],
					})
				}).addTo(map);
				_putCache(marker_typhoon);
				_putCache(_addTyphoonPoint(item_first, _getPropupHtml(typhoon_info.cnName||typhoon_info.enName)));
				var is_forcast = false;
				function _run(){
					var item_start = items[current_index-1],
						item_end = items[current_index];
					var option_polyline = {
						color: 'rgba(255, 255, 255, 0.6)',
						weight: 3
					};
					if(is_forcast){
						option_polyline.dashArray = [15, 10];
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
					}
					var is_can_next = false;
					if(current_index < last_index){
						current_index++;
						is_can_next = true;
					}else{
						items = item_end.forecast;
						if(items){
							items.unshift(item_end);
							current_index = 1;
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
				html_title += '<li>'+v.cnName+'(第'+v.index+'号台风'+v.enName+')</li>';
			});
			if(html_title){
				$typhoon_list.show();
			}else{
				$typhoon_list.hide();
			}
			$typhoon_list.html(html_title);
		}
		var $btn_typhoon_list,
			$typhoon_list;

		// var ecObj;
		// 绑定事件
		$(function(){
			$btn_typhoon_list = $('.btn_typhoon_list').delegate('.btn_typhoon', 'click', function(){
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
			});
			$typhoon_list = $('.typhoon_list');
			$('#btn_close_typhoon_chart').click(function(){
				$(this).parent().hide();
			});
			// $.getScript('./js/echarts.js', function(){
				require.config({
			        paths: {
			            echarts: './js'
			        }
			    });
				require([
		            'echarts',
		            'echarts/chart/line',
		        ], function (ec) {
		        	ecObj = ec;
		        	_initChart();
		        });
			// });
		});
		function _initChart(){
			if(ecObj){
				myChart = ecObj.init($('#typhoon_chart').get(0));
	            myChart.setOption({
	            	color: ['white'],
	            	grid: {
	            		borderColor: 'rgba(0, 0, 0, 0)'
	            	},
				    tooltip : {
				        trigger: 'axis'
				    },
				    legend: {
				    	show: false,
				        data:['意向']
				    },
				    calculable : true,
				    xAxis : {
			            show: 0,
			            boundaryGap : false,
			            data : ['周一','周二','周三','周四','周五','周六','周日']
			        },
				    yAxis : {	
			        	show: 0
				    },
				    series : [
				        {
				            name:'成交',
				            type:'line',
				            smooth: 1,
				            symbolSize: 6,
				            itemStyle: {
				            	normal: {
				            		areaStyle: {
				            			type: 'default',
				            			color: (function (){
				                            var zrColor = require('zrender/tool/color');
				                            return zrColor.getLinearGradient(
				                                0, 400, 0, 0,
				                                [[0, '#CC6D35'],[0.5, '#C5C153'], [0.7, '#5FA5A3']]
				                            )
				                        })()
				            		},
				            		lineStyle: {
				            			color: 'rgba(0, 0, 0, 0)'
				            		}
				            	}
				            },
				            data:[10, 12, 21, 54, 21, 10, 25]
				        }
				    ]
	            });

			}
		}
		function _initBtns(list){
			var html = '';
			$.each(list, function(i, v){
				cache_typhoon[v.code] = v;
				html += '<div class="box btn_typhoon" data-code="'+v.code+'">'+(v.cnName||v.enName)+'</div>';
				
			});
			$btn_typhoon_list.html(html);
		}
		return {
			init: function(){
				rootScope.show_typhoon = true;
				_getTyphoonList(function(typhoonList){
					rootScope.typhoonList = typhoonList;
					_initBtns(typhoonList);
				}, true);
			},
			remove: function(){
				var cache_list = cache_typhoon[URL_LIST];
				if(cache_list){
					for(var i = 0, j = cache_list.length; i<j; i++){
						_removeTyhoon(cache_list[i].code);
					}
				}
			}
		}
	}]);
}(angular)