$(function() {
	var conf = {
		'haze': {
			name: '全国霾区预报',
			dataurl: 'http://scapi.weather.com.cn/weather/micapsfile?fileMark=haze_fc&isChina=true',
			type: 'micaps'
		},
		'fog': {
			name: '全国雾区预报',
			dataurl: 'http://scapi.weather.com.cn/weather/micapsfile?fileMark=fog_fc&isChina=true',
			type: 'micaps'	
		},
		'aqi_wr': {
			name: '空气污染气象条件预报',
			dataurl: 'http://scapi.weather.com.cn/weather/micapsfile?fileMark=kqzl_24,kqzl_48,kqzl_72&isChina=true',
			type: '3d'
		},
		'aqi': {
			name: '空气质量',
			dataurl: 'http://scapi.weather.com.cn/weather/getaqiobserve',
			type: 'aqi'
		},
		'rain3d': {
			name: '未来三天降水量预报',
			dataurl: 'http://scapi.weather.com.cn/weather/micapsfile?fileMark=js_24_fc,js_48_fc,js_72_fc&isChina=true',
			type: 'micaps'
		},
		'xsc': {
			name: '亚欧地面场分析',
			// dataurl: 'http://scapi.weather.com.cn/weather/micapsfile?fileMark=h000&isChina=false',
			dataurl: './data/xsc.json',
			is_file: true,
			type: 'micaps'
		},
		'xsc500': {
			name: '亚欧高空场500hPa',
			dataurl: 'http://scapi.weather.com.cn/weather/micapsfile?fileMark=h500&isChina=false',
			type: 'micaps'
		},
		'tongji': {
			name: '天气统计',
			dataurl: 'http://scapi.weather.com.cn/weather/stationinfo',
			type: 'tongji'
		}
	}

	$('.box_btn_close').click(function() {
		$(this).closest('.box_dialog').hide();
	});
	// var map;
    var _overlays = [];
    W.require.bind(null, ['maps'], function(a) {
        map = a;
    })();

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
    function _renderMicaps(data) {
    	var areas = data.areas;
        if (areas) {
        	_each(areas, function(i, v) {
        		var arr = [];
        		_each(v.items, function(ii, point) {
        			arr.push([point.y, point.x]);
        		})

        		var polygon = L.polygon(arr, {
        			stroke: false,
        			fill: true,
        			fillColor: v.c,
        			fillOpacity: 0.6
        		}).addTo(map);

        		_overlays.push(polygon);
        	});
        }
        var line_symbols = data.line_symbols;
		if (line_symbols) {
			var color_symbols = {
				2: 'blue',
				3: 'red',
				38: 'red'
			};
			_each(line_symbols, function(i, v) {
				if(v.code == 0){
					return;
				}
				var arr = [];
				var points = v.items;
        		_each(points, function(ii, point) {
        			arr.push([point.y, point.x]);
        		})
				var polyline = L.polyline(arr, {
        			stroke: true,
        			color: color_symbols[v.code],
        			weight: 2
        		}).addTo(map);

        		_overlays.push(polyline);
			});
		}
        // 14类中的普通线
		var lines = data.lines;
		if(lines) {
			_each(lines, function(i, v) {
				var arr = [];
        		_each(v.items || v.point, function(ii, point) {
        			arr.push([point.y, point.x]);
        		})
				var polyline = L.polyline(arr, {
        			stroke: true,
        			color: '#fff',
        			weight: 2
        		}).addTo(map);

        		_overlays.push(polyline);

        		var flags = v.flags;
				if(flags && flags.items && flags.items.length > 0){
					var text = flags.text;
					_each(flags.items, function(i, v){
						var marker = L.marker([v.y, v.x], {icon: L.divIcon({
							iconSize: L.point(40, 40),
							className: 'micaps_text',
							html: '<span style="font-weight:normal;font-size: 20px;">'+text+'</span>'
						})}).addTo(map);
						_overlays.push(marker);
					});
				}
			});
		}
		var symbols = data.symbols;
		if(symbols){
			_each(symbols, function(i, v){
				var type = v.type;

				var text = '',
					color = '',
					fontSize = 30,
					styleExtra = null,
					offset = null,
					fontWeight = '';

				if('60' == type){
					text = 'H';
					color = 'red';
				}else if('61' == type){
					text = 'L';
					color = 'blue';
				}else if('37' == type){
					text = '台';
					color = 'green';
				}else if('48' == type){
					fontWeight = 'font-weight: bold;';
					text = v.text;
					fontSize = 14;
					styleExtra = {
						shadowBlur: 4,
						shadowColor: '#ffffff'
					};
					offset = {
						x: 0,
						y: -24
					};

					// var marker = L.marker([v.y, v.x], {icon: L.divIcon({
					// 	className: 'micaps_text',
					// 	html: '╳'
					// })}).addTo(map);

					// _overlays.push(marker);
				}
				if(text){
					var marker = L.marker([v.y, v.x], {icon: L.divIcon({
						iconSize: L.point(40, 40),
						className: 'micaps_text',
						html: '<span style="color: '+color+'">'+text+'</span>'
					})}).addTo(map);
					_overlays.push(marker);
				}
			});
		}
    }

    // 天气统计
    var global_data_tongji;
    var $tongji_panel = $('#tongji_panel');
    function _tongji() {
    	if (!global_data_tongji) {
    		return;
    	}
    	_clear();

		var zoom = map.getZoom();
		var arr_stations = global_data_tongji['level1'].slice();
		if (zoom > 6) {
			arr_stations = arr_stations.concat(global_data_tongji['level2'].slice());
		}
		if (zoom > 9) {
			arr_stations = arr_stations.concat(global_data_tongji['level3'].slice());
		}
		var bound = map.getBounds();
		_each(arr_stations, function(i, v) {
			var p = L.latLng(v.lat, v.lon);
			if (bound.contains(p)) {
				var myIcon = L.divIcon({className: 'station', html: '<p>'+v.name+'</p>', iconSize: L.point(80, 90)});
				var marker = L.marker(p, {icon: myIcon, zIndexOffset: 10}).addTo(map).on('click', function() {
					$tongji_panel.show();
					var $tongji_bar_container = $tongji_panel.find('.tongji_bar_container').html('');
					$tongji_panel.find('.tongji_title').html(v.name+' '+v.stationid);
					$tongji_panel.addClass('loading');
					Util.req(Util.encryURL('http://scapi.weather.com.cn/weather/historycount?stationid='+v.stationid+'&areaid='+v.areaid), {
						loading: false
					}, function(err, data) {
						$tongji_panel.removeClass('loading');
						var days = data.days;
						var starttime = data.starttime;
						var endtime = data.endtime;

						var colors = {
							'雨': 'rgba(41, 193, 8, 1)',
							'雪': 'rgba(141, 152, 179, 1)',
							'沙尘': 'rgba(253, 104, 1, 1)',
							'雾': 'rgba(89, 255, 255, 1)',
							'霾': 'rgba(201, 155, 20, 1)',
							'其它': 'rgba(204, 204, 204, 1)',
							'_': 'rgba(151, 181, 82, 1)'
						};
						var len = data.tqxxcount.length;
						_each(data.tqxxcount, function(i, v) {
							var perc = v.value / days;
							var $html = $('<div class="tongji_bar_wrap" style="width:'+(1/len*100)+'%"><div class="tongji_bar"></div><p>'+v.name+'<br/>'+v.value+'天</p></div>').appendTo($tongji_bar_container);
							
							new Util.UI.Ring({
								container: $html.find('.tongji_bar'),
								circlePercent: {
					    			color: colors[v.name] || colors['_']
					    		},
					    		percent: perc
							});
						});
						var count = data.count;
						var tmp = count[0];
						var wind = count[5];
						var rain = count[1];
						var desc = '自'+starttime+'至'+endtime+':<br/>'+
							'日最高气温<em>'+tmp.max+'</em>℃, 日最低气温<em>'+tmp.min+
							'</em>℃, 日最大风速<em>'+wind.max+
							'</em>m/s, 日最大降水量<em>'+rain.max+
							'</em>mm, 连续无降水日数<em>'+data.no_rain_lx+
							'</em>天, 连续霾日数<em>'+data.mai_lx+'</em>天。';
						$tongji_panel.find('.tongji_desc').html(desc);
					})
				});
				_overlays.push(marker);
			}
		});
    }

    // 全国空气质量
    var global_data_aqi;
    var $aqi_panel = $('#aqi_panel');
    $aqi_panel.find('.btn_close_aqi').click(function() {
    	$aqi_panel.hide();
    });
    function _aqi() {
    	if (!global_data_aqi) {
    		return;
    	}
    	_clear();

		var zoom = map.getZoom();
		var arr_stations = global_data_aqi['level1'].slice();
		if (zoom > 6) {
			arr_stations = arr_stations.concat(global_data_aqi['level2'].slice());
		}
		if (zoom > 9) {
			arr_stations = arr_stations.concat(global_data_aqi['level3'].slice());
		}
		var bound = map.getBounds();
		_each(arr_stations, function(i, v) {
			var p = L.latLng(v.lat, v.lon);
			if (bound.contains(p)) {
				var level = v.aqi;
				var conf = {};
				if(level >= 0 && level <= 50) {
					conf = {
						cname: 'you',
						name: '优',
						color: 'rgb(0, 228, 0)',
						desc: '空气质量令人满意，基本无空气污染，各类人群可正常活动。'
					}
				} else if(level >= 51 && level <= 100) {
					conf = {
						cname: 'liang',
						name: '良',
						color: 'rgb(255, 255, 0)',
						desc: '空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响，建议极少数异常敏感人群应减少户外活动。'
					}
				} else if(level >= 101 && level <= 150) {
					conf = {
						cname: 'qingdu',
						name: '轻度',
						color: 'rgb(255, 126, 0)',
						desc: '易感人群症状有轻度加剧，健康人群出现刺激症状。建议儿童、老年人及心脏病、呼吸系统疾病患者应减少长时间、高强度的户外锻炼。'
					}
				} else if(level >= 151 && level <= 200) {
					conf = {
						cname: 'zhongdu',
						name: '中度',
						color: 'rgb(255, 0, 0)',
						desc: '进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响，建议疾病患者避免长时间、高强度的户外锻练，一般人群适量减少户外运动。'
					}
				} else if(level >= 201 && level <= 300) {
					conf = {
						cname: 'zhongduwuran',
						name: '重度',
						color: 'rgb(153, 0, 76)',
						desc: '心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状-建议儿童、老年人和心脏病、肺病患者应停留在室内，停止户外运动，一般人群减少户外运动。'
					}
				} else if(level >= 301) {
					conf = {
						cname: 'yanzhong',
						name: '严重',
						color: 'rgb(126, 0, 35)',
						desc: '健康人群运动耐受力降低，有明显强烈症状，提前出现某些疾病-建议儿童、老年人和病人应当留在室内，避免体力消耗，一般人群应避免户外活动。'
					}
				}

				var myIcon = L.divIcon({className: 'station_aqi aqi_'+conf.cname, html: '<p>'+v.name+'</p>', iconSize: L.point(55, 63)});
				var marker = L.marker(p, {icon: myIcon, zIndexOffset: 10}).addTo(map).on('click', function() {
					$aqi_panel.find('.aqi_location').text(v.name);
					$aqi_panel.find('.aqi_val').text(v.aqi);
					$aqi_panel.find('.aqi_level').css('background-color', conf.color).text(conf.name);
					$aqi_panel.find('.aqi_desc').text('温馨提示：'+conf.desc);
					$aqi_panel.find('.aqi_info div').css('border-color', conf.color);
					$aqi_panel.find('.aqi_val_aqi').text(v.rank);
					$aqi_panel.find('.aqi_val_pm25').text(v.pm2_5);
					$aqi_panel.find('.aqi_val_pm10').text(v.pm10);
					$aqi_panel.show();
				});
				_overlays.push(marker);
			}
		});
    }
    var method = {
    	micaps: function(data) {
    		data = data.slice(0, 1);
			_each(data, function(i, v) {
				_renderMicaps(v);
			});
    	},
    	tongji: function(data) {
    		global_data_tongji = data;

		    map.on('zoomend', _tongji);
		    map.on('dragend', _tongji);
    		_tongji();
    	},
    	aqi: function(data) {
    		global_data_aqi = data.data;

		    map.on('zoomend', _aqi);
		    map.on('dragend', _aqi);
    		_aqi();
    	}
    }
    function _reset() {
    	map.off('zoomend', _tongji);
		map.off('dragend', _tongji);
		global_data_tongji = null;
		global_data_aqi = null;
    }
	window.Micaps = {
		init: function(productName) {
			var confOfProduct = conf[productName];
			if (confOfProduct) {
				var url = confOfProduct.dataurl;
				if (!confOfProduct.is_file) {
					url = Util.encryURL(url);
				}
				Util.req(url, {
					dealError: false
				}, function(err, data) {
					console.log(err, data);
					_reset();
					if (err) {
						alert(productName+'数据请求出现错误！');
					} else {
						_clear();
						var m = method[confOfProduct.type];
						m && m(data);
					}
				});
			}
		},
		clear: function() {
			_reset();
			_clear();
		},
		getConf: function(name) {
			var c = conf[name];
			if (c) {
				return c;
			}
		}
	}
})