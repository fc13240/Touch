$(function() {
    var DATA_URL = 'http://decision.tianqi.cn//data/video/videoweather.html';
    
    var _cache = {};
    function _getData(cb) {
        var val = _cache[DATA_URL];
        if (val) {
            cb(val);
        } else {
            $.getJSON(DATA_URL, function(data) {
                _cache[DATA_URL] = data;
                
                cb(data);       
            });
        }
    }
    var map;
    var _overlays = [];
    W.require.bind(null, ['maps'], function(a) {
        map = a;
    })();
    
    var $video_player = $('#video_player');
    var $btn_close_video = $('.btn_close_video').click(function() {
        $video_player.hide().find('source').removeAttr('src');
    });
    var inited = false;
    window.Camera = {
        init: function() {
            if (inited) {
                return;
            }
            _getData(function(data) {
                $.each(data, function(i, v) {
                    var myIcon = L.icon({
                        iconUrl: 'img/weather_camera_icon.png',
                        iconSize: [50, 50]
                    });
                    Util.download.video(v.url, function(src) {
                        var marker = L.marker([v.lat, v.lon], {icon: myIcon, zIndexOffset: 10}).addTo(map).on('click', function() {
                            $video_player.show().find('source').attr('src', src);
                            var video = $video_player.find('video').get(0);
                            video.load();
                            video.play();
                        });
                        _overlays.push(marker);
                    });
                });
                inited = true;
            });            
        },
        remove: function(params) {
            var tmp;
            while((tmp = _overlays.shift())) {
                map.removeLayer(tmp);
            }
            $btn_close_video.click();
        }
    };
})