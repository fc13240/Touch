!function() {
    // 此文件要求必须 require 进来，才进准确使用 require 相对路径
    var path = require('path');
    var tool = require('../console/tool');
    // require('../libs/jquery.touch');
    // require('../libs/jquery.swipe');
    require('../libs/swiper');
    Util.addCSS(path.join(__dirname, '../../css/libs/swiper.css'));
    Util.addCSS(path.join(__dirname, '../../css/libs/video-js.css'));

    var videojs = require('../libs/videojs');

    var $wrap_gallery = $('.wrap_gallery');
    
    var _getId = (function() {
        var id = 0;
        return function() {
            return 'video_'+id++;
        }
    })();

    var gallery_swiper;
    function _init() {
        gallery_swiper && gallery_swiper.destroy(false, true);
        $wrap_gallery.show();
        var gallery = tool.getGallery(true);
        $wrap_gallery.addClass('full');
        var list = gallery.list || [];
        var html = '';
        list.forEach(function(v) {
            var type = v.type;
            var file = v.file;
            html += '<div class="swiper-slide item '+type+'" '+(new Date())+'>';
            if (type == 'img') {
                html += '<img src="'+file+'"/>';
            } else if (type == 'video') {
                html += '<video id="'+_getId()+'" muted class="video-js" controls preload="auto" width="100%" height="100%" data-setup="{}" >';
                    html += '<source src="'+file+'" type="video/mp4">';
                html += '</video>';
            }
            html += '</div>';
        });

        $wrap_gallery.find('.swiper-wrapper').html(html);

        var videos = [];
        gallery_swiper = new Swiper($wrap_gallery, {
            initialSlide: 0,
            onSlideChangeStart: function() {
                $.each(videos, function(i, v) {
                    v.pause();
                });
            },
            grabCursor: true,
            followFinger: true,
            freeModeMomentum: false,
            effect: 'coverflow',
            // effect: 'fade',
            // fade: { crossFade: true }
        });
        // $wrap_gallery.swiper();
        // $wrap_gallery.swiper({
        //     initialSlide: 0,
        //     onSlideChangeStart: function() {
        //         $.each(videos, function(i, v) {
        //             v.pause();
        //         });
        //     },
        //     freeMode: true,
        //     freeModeMomentum: false,
        //     // effect: 'coverflow',
        //     // effect: 'fade',
        //     // fade: { crossFade: true }
        // });
        $wrap_gallery.find('video').each(function() {
            var $this = $(this);
            var $p = $this.parent();
            $this.css({
                width: $p.width(),
                height: $p.height()
            });
            try {
                videos.push(videojs($this.attr('id')));
            } catch(e){
                console.log(e);
            }
        });
    }
    var $doc = $(document).on('reload', function() {
        Gallery.init();
    });

    window.Gallery = {
        init: function() {
            _init();
        },
        clear: function() {
            $wrap_gallery.hide();
        }
    }
}()