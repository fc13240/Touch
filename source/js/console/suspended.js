!function() {
    var UI = require('./component').UI;
    var path = require('path');
    var ui_file = UI.file;
    var tool = require('./tool');
    var Dialog = require('./dialog');
    var _alert = Dialog.alert;
    var _confirm = Dialog.confirm;
    var $doc = $(document);
    var $suspended = $('.suspended');
    var $cb_use_suspended = $('#cb_use_suspended');
    var $x_suspended = $('.x_suspended');
    var $y_suspended = $('.y_suspended');
    var $width_suspended = $('.width_suspended');
    var $height_suspended = $('.height_suspended');

    // NOTICE: 暂时不考虑重复添加
    $suspended.delegate('.btn_add_img', 'click', function() {
        Dialog.sourceOpen(function(source) {
            tool.formatSource(source, function(err, list) {
                if (!err && list && list.length > 0) {
                    var html = _getListHtml(list);
                    $suspended.find('.btn_add_img').before(html);
                    
                    _initSortableSuspended();
                }
            });
        });
    });
    $suspended.on('click', '.time_show', function(e) {
        e.stopPropagation();
    });
    $suspended.on('click', 'li.item', function() {
        // 防止拖动影响
        if (!$(this).data('_sortable')) {
            $(this).toggleClass('on');
        }
    });
    $suspended.delegate('.btn_close', 'click', function(e) {
        e.stopPropagation();
        var $item = $(this).closest('li');
        $item.fadeOut(function() {
            $item.remove();
        });
    });
    function _initSortableSuspended() {
        $suspended.sortable({
            handle: ".handle",
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
    function _getListHtml(list) {
        var html = '';
        $.each(list, function(i, item) {
            var type = item.type;
            var file = item.file;
            var file_source = item.file_source;
            var name = path.basename(file_source || file);
            html += '<li title="'+name+'" class="item '+type+' '+(item.flag?'on':'')+'" data-type="'+type+'" data-file="'+file+'" '+(file_source? 'data-source="'+file_source+'"':'')+'>';
            html += '<div class="handle"></div>';
            if (type == 'img') {
                html += '<img src="'+file+'"/>';
            } else if (type == 'video') {
                html += '<video muted autoplay="autoplay" preload="auto" width="100%" height="100%" loop>'+
                            '<source src="'+file+'">'+
                        '</video>';
            }
            html += '<span class="btn_close"></span>';
            html += '<div class="time_show">';
            html += '显示时长：<input type="number" step=1 placeholder="显示时长（单位秒）" value="'+(item.time||5)+'"/>秒';
            html += '</div>';
            html += '</li>';
        });
        return html;
    }

    var suspendedData = Object.assign(tool.getSuspended() || {}, {
        x: 0,
        y: 0,
        width: 400,
        height: 400
    });
    var suspendedList = suspendedData.list || [];
    function initList(list) {
        var html = _getListHtml(list);
        html += '<li class="btn_add_img">+</li>';
        $suspended.html(html);
        
        _initSortableSuspended();
    }

    initList(suspendedList);
    $x_suspended.val(suspendedData.x);
    $y_suspended.val(suspendedData.y);
    $width_suspended.val(suspendedData.width);
    $height_suspended.val(suspendedData.height);
    $cb_use_suspended.prop('checked', suspendedData.flag);

    $('#btnSaveSuspended').on('click', function() {
        var x = parseInt($x_suspended.val());
        if (isNaN(x)) {
            return _alert('请确保距右侧距离为数值！');
        }
        var y = parseInt($y_suspended.val());
        if (isNaN(y)) {
            return _alert('请确保距顶部距离为数值！');
        }
        var width = parseInt($width_suspended.val());
        if (isNaN(width)) {
            return _alert('请确保宽度为数值！');
        }
        var height = parseInt($height_suspended.val());
        if (isNaN(height)) {
            return _alert('请确保高度为数值！');
        }
        var arr = [];
        $suspended.find('li.item').each(function() {
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
            d.time = parseFloat($this.find('.time_show input').val());
            arr.push(d);
        });

        var data = {
            flag: $cb_use_suspended.prop('checked'),
            x: x,
            y: y,
            width: width,
            height: height,
            list: arr
        }
        tool.setSuspended(data);

        $doc.trigger('save');
        _alert('配置完成，请在主界面中查看!');
    });
}();