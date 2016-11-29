!function() {
    var UI = require('./component').UI;
    var path = require('path');
    var ui_file = UI.file;
    var tool = require('./tool');
    var Dialog = require('./dialog');
    var _alert = Dialog.alert;
    var _confirm = Dialog.confirm;
    var $gallery = $('.gallery');

    // NOTICE: 暂时不考虑重复添加
    $gallery.delegate('.btn_add_img', 'click', function() {
        Dialog.sourceOpen(function(source) {
            tool.formatSource(source, function(err, list) {
                if (!err && list && list.length > 0) {
                    var html = _getListHtml(list);
                    $gallery.find('.item:last').after(html);
                    
                    _initSortableGallery();
                }
            });
        });
    });

    var galleryData = tool.getGallery() || {};
    var galleryList = galleryData.list || [];

    var $doc = $(document);
    var file_dir_gallery = ui_file($('.file_dir_gallery'), {
        placeholder: '请选择资源所在目录',
        val: galleryData.dir,
        dialogOpt: {
			properties: ['openDirectory']
		},
        onchange: function(e, filepath) {
            _read(filepath);
        }
    });

    function _getListHtml(list) {
        var html = '';
        $.each(list, function(i, item) {
            var type = item.type;
            var file = item.file;
            var file_source = item.file_source;
            var name = path.basename(file_source || file);
            html += '<li title="'+name+'" class="item '+type+' '+(item.flag?'on':'')+'" data-type="'+type+'" data-file="'+file+'" '+(file_source? 'data-source="'+file_source+'"':'')+'>';
            if (type == 'img') {
                html += '<img src="'+file+'"/>';
            } else if (type == 'video') {
                html += '<video muted autoplay="autoplay" preload="auto" width="100%" height="100%" loop>'+
                            '<source src="'+file+'">'+
                        '</video>';
            }
            html += '<span class="btn_close"></span>';
            html += '</li>';
        });
        return html;
    }
    function _initSortableGallery() {
        $gallery.sortable({
            cancel: '.btn_add_img',
            placeholder: "ui-state-highlight",
            revert: 200,
            start: function( e, ui ) {
                ui.item.data('_sortable', true);
            },
            stop: function(e, ui) {
                ui.item.removeData('_sortable');
            }
        }).disableSelection();
    }
    function initList(list) {
        var html = _getListHtml(list);
        html += '<li class="btn_add_img">+</li>';
        $gallery.html(html);
        
        $gallery.find('li.item').on('click', function() {
            // 防止拖动影响
            if (!$(this).data('_sortable')) {
                $(this).toggleClass('on');
            }
        }).find('.btn_close').on('click', function(e) {
            e.stopPropagation();
            var $item = $(this).closest('li');
            $item.fadeOut(function() {
                $item.remove();
            });
        });
        _initSortableGallery();
    }

    function _read(dir) {
        tool.readSource(dir, function(err, list) {
            if (!err) {
                if (list.length > 0) {
                    initList(list);
                } else {
                    alert('此目录下没有图片或视频资源，请重新选择目录！');
                }
            } else {
                alert('出现错误，请重新选择目录！');
            }
        });
    }
    // _read('C:\\Users\\技术\\BPA\\GT\\output\\添加南海数据');

    
    initList(galleryList);
    $('#btnSaveGallery').on('click', function() {
        var arr = [];
        $gallery.find('li.item').each(function() {
            var $this = $(this);
            var d = {
                file: $this.data('file'),
                flag: $this.hasClass('on'),
                type: $this.data('type')
            };
            var source = $this.data('source');
            if (source) {
                d.file_source = source;
            }
            arr.push(d);
        });

        var data = {
            dir: file_dir_gallery.val(),
            list: arr
        }

        tool.setGallery(data);

        $doc.trigger('save');
        _alert('配置完成，请在主界面中查看!');
        
    });
}()