$(function() {
	var req = Util.req;
	var Loading = Util.Loading;
	var map;
	W.require.bind(null, ['maps'], function(a) {
        map = a;
    })();
    var _getAlarmInfo = (function(){
        var yjlb = ['台风', '暴雨', '暴雪', '寒潮', '大风', '沙尘暴', '高温', '干旱', '雷电', '冰雹', '霜冻', '大雾', '霾', '道路结冰'];
        var gdlb = ['寒冷', '灰霾', '雷雨大风', '森林火险', '降温', '道路冰雪','干热风','低温','冰冻'];
        var yjyc = ['蓝色', '黄色', '橙色', '红色'];
        var gdyc = ['白色'];
        //得到预警描述及等级
        var REG = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})\.html/;
        return function(data){
            var m = REG.exec(data[1]);
            var result = {};
            if(m){
                var textIndex = parseInt(m[7],10);
                var text = '';
                if(textIndex > 90){
                    text = gdlb[textIndex-91];
                }else{
                    text = yjlb[textIndex - 1];
                }

                var level = '';
                var levelIndex = parseInt(m[8],10);
                if(levelIndex > 90){
                    level = gdyc[levelIndex - 91];
                }else{
                    level = yjyc[levelIndex - 1];
                }

                // var val = data[0]+m[1]+'年'+m[2]+'月'+m[3]+'日'+m[4]+'时'+m[5]+'分发布'+text+level+'预警';
                var img = '';
                if(level > 90 ||textIndex > 90){
                    img = '0000';
                }else{
                    img = m[7]+m[8];
                }
                result.title = data[0]+'气象台发布'+text+level+'预警';
                result.time = m[1]+'-'+m[2]+'-'+m[3]+' '+m[4]+':'+m[5]+':'+m[6];
                result.img = './img/waring/icon_warning_'+img+'.png';
                // result.url = 'http://www.weather.com.cn/data/alarm/'+data[1];
                result.url = 'http://decision.tianqi.cn/alarm/wapdata/'+data[1];;
                result.gov = data[0];
                result.pos = [data[3], data[2]];
            }
            return result
        }
    })();

    function _req(cb) {
    	var option = {unique: false, loading: false};
    	var req_GJ = req('http://decision.tianqi.cn/data/cmaalarm/index.html', option);
    	var req_alarm_list = req('http://decision.tianqi.cn/alarm/grepalarmBox.php?areaid=[\\d]{5,7}', option);

    	Loading.req();
    	$.when(req_GJ, req_alarm_list).done(function(a, b) {
    		Loading.hide();

    		var list = [];
    		var data = b[0].data;
    		data && $.each(data, function(i, v) {
    			list.push(_getAlarmInfo(v));
    		});
    		cb && cb(list);
    	});
    }
    var WIDTH_MAX = $(window).width() < 1024? 200: 500;
    function _detail(url, pos) {
    	map.closePopup();
    	req(url, function(err, data) {
			L.popup({
				className: 'alarm_detail box',
				maxWidth: WIDTH_MAX,
				// keepInView: true
			}).setLatLng(pos)
			.setContent('<div class="alarm_detail_title">'+
		    	data.PROVINCE+data.CITY+data.SIGNALTYPE+data.SIGNALLEVEL+
		    	'预警</div><p class="alarm_detail_desc">'+data.ISSUECONTENT+'</p>')
		    .openOn(map);
		});
    }

    var _overlays = [];
    window.Alarm = {
    	init: function() {
    		_req(function(data) {
    			if (data) {
	    			$.each(data, function(i, v) {
	    				var myIcon = L.divIcon({className: 'alarm_layer', html: '<img src="'+v.img+'"/>', iconSize: L.point(60, 60)});
						var marker = L.marker(v.pos, {icon: myIcon, zIndexOffset: 10}).addTo(map).on('click', function() {
							_detail(v.url, v.pos);
						});

						_overlays.push(marker);
	    			});
    			}
    		});
    	}, clear: function() {
    		map.closePopup();
    		var tmp;
    		while((tmp = _overlays.shift())) {
    			map.removeLayer(tmp);
    		}
    	}
    }
})