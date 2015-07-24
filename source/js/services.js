!function(angular){
	angular.module('services', []).service('typhoon', ["$rootScope", "maps", function(rootScope, map){
		var URL_TYPHOON = 'http://typhoon.weather.gov.cn/Typhoon/data/';
		var cache_typhoon = {};
		function _getTyphoonList(cb, is_active){
			$.get(URL_TYPHOON + 'typhoonList.xml', function(result){
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
				if(is_active){
					list.sort(function(a, b){
						return a.code.localeCompare(b.code)
					});
					list = list.filter(function(v){
						if(v.is_active){
							return v;
						}
					});
				}
				cb(list);
			});
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
								aging: parseInt($ele.attr('V04')),
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
		function _addTyphoonPoint(item){
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
			var myIcon = L.divIcon({className: cname, html: ''});
			var marker = L.marker([item.lat, item.lng], {icon: myIcon}).addTo(map).on('click', function(){
				if(_prev_marker){
					var cn = _prev_marker.options.icon.options.className;
					_prev_marker.setIcon(L.divIcon({className: cn, html: ''}));
				}
				var myIcon = L.divIcon({className: cname, html: _getWindRadiu(7, item)+_getWindRadiu(10, item)});
				marker.setIcon(myIcon);
				marker.setZIndexOffset(-100);
				_prev_marker = marker;
				console.log(_prev_marker);
			});
			return marker;
		}
		map.on('zoomstart', function(){
			if(_prev_marker){
				var cn = _prev_marker.options.icon.options.className;
				_prev_marker.setIcon(L.divIcon({className: cn, html: ''}));
			}
		});
		var overlays_cache = {};
		function _showTyphoon(code){
			_getTyphoonDetail(code, function(items){
				var _cache = overlays_cache[code] || (overlays_cache[code] = []);
				_cache.push(_addTyphoonPoint(items[0]));
				for(var i = 1, j = items.length; i<j; i++){
					var item_start = items[i-1],
						item_end = items[i];

					var polyline = L.polyline([L.latLng(item_start.lat, item_start.lng), L.latLng(item_end.lat, item_end.lng)], 
						{color: 'rgba(255, 255, 255, 0.6)'}).addTo(map);
					_cache.push(polyline);

					_cache.push(_addTyphoonPoint(item_end));
				}

			});
		}
		function _removeTyhoon(code){
			var overlays = overlays_cache[code];
			if(overlays){
				$.each(overlays, function(i, v){
					map.removeLayer(v);
				});
			}
		}
		var $btn_typhoon_list,
			$typhoon_list;

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

			});
			$typhoon_list = $('.typhoon_list');
		});
		function _initBtns(list){
			var html = '';
			var html_title = '';
			$.each(list, function(i, v){
				html += '<div class="box btn_typhoon" data-code="'+v.code+'">'+(v.cnName||v.enName)+'</div>';
				html_title += '<li>'+v.cnName+'(第'+v.index+'号台风'+v.enName+')</li>';
			});
			$btn_typhoon_list.html(html);
			$typhoon_list.html(html_title);
		}
		return {
			init: function(){
				rootScope.show_typhoon = true;
				_getTyphoonList(function(typhoonList){
					rootScope.typhoonList = typhoonList;
					_initBtns(typhoonList);
				}, true);
			}
		}
	}]);
}(angular)