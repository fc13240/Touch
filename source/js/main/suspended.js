!function() {
    var tool = require('../console/tool');
    var $wrap_suspended = $('.wrap_suspended');

    var gallery_swiper;
    function Pager() {
        var _this = this;
        _this.index = 0;
        _this.$items = $wrap_suspended.find('.suspended_item');
    }
    var prop = Pager.prototype;
    prop.next = function() {
        var _this = this;
        clearTimeout(_this.tt);
        var $item_show = _this.$items.hide().eq(_this.index).show();
        var video = $item_show.find('video').get(0);
        video && video.play();
        _this.tt = setTimeout(function() {
            var v = _this.$items.eq(_this.index).find('video').get(0);
            if (v) {
                v.pause();
                v.currentTime = 0;
            }
            if (_this.$items.length - 1 > _this.index) {
                _this.index++;
            } else {
                _this.index = 0;
            }

            _this.next();
        }, (_this.$items.eq(_this.index).data('time')||5)*1000);
    }
    prop.stop = function() {
        clearTimeout(this.tt);
        this.$items.each(function() {
            var v = $(this).find('video').get(0);
            if (v) {
                v.pause();
                v.currentTime = 0;
            }
        });
    }

    var _pager;
    function _init() {
        var suspended = tool.getSuspended() || {};
        _pager && _pager.stop();
        
        if (suspended.flag) {
            var html = '';
            $.each(suspended.list, function(i, item) {
                var type = item.type;
                var file = item.file;
                html += '<div class="suspended_item" data-time="'+item.time+'">';
                if (type == 'img') {
                    html += '<img src="'+file+'"/>';
                } else if (type == 'video') {
                    html += '<video preload="auto" src="'+file+'"/>';
                }
                html += '</div>';
            });
            $wrap_suspended.css({
                right: suspended.x || 0,
                top: suspended.y || 0,
                width: suspended.width || 400,
                height: suspended.height || 400
            }).show().html(html);

            _pager = new Pager();
            _pager.next();
        } else {
            $wrap_suspended.hide();
        }
    }
    $doc = $(document).on('reload', _init);
    _init();
}()