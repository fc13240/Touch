!function() {
    var electron = require('electron');
    var remote = electron.remote;
    var dialog = remote.require('electron').dialog;
    var win = remote.getCurrentWindow();
    var ipc = electron.ipcRenderer;

    $('tab item').on('click', function() {
        $('#'+$(this).data('for')).css({
            display: 'block'
        }).siblings().hide();
    }).first().click();

    var tool = require('./js/console/tool');
    var confUser = tool.getConf() || {};
    var menuMixture = tool.getMenuMixture(true);

    var _getId = (function() {
        var id = 0;

        return function() {
            return 'cb'+id++;
        }
    })();
    function _getCb(item) {
        var id = _getId();
        var name = item.name;

        return '<div class="checkbox"><input type="checkbox" id="'+id+'" '+(!item.isAppend? 'checked': '')+'/><label for="'+id+'">'+name+'</label></div>';
    }

    // 绑定数据并显示
    var html = '<ul class="sortable">';
    menuMixture.forEach(function(v) {
        var id = _getId();
        html += '<li class="level1 ">';
        html += _getCb(v);
        var sub = v.sub;
        if (sub && sub.length > 0) {
            html += '<ul class="sortable">';
            sub.forEach(function(item) {
                html += '<li class="level2">'+_getCb(item)+'</li>';
            });
            html += '</ul>';
        }
        html += '</li>';
    });
    html += '</ul>'

    // 对checkbox的点击事件进行处理
    $('.wrap_product').html(html).find('.checkbox').on('click', function() {
        var $this = $(this);
        var isChecked = $this.find('[type=checkbox]').prop('checked');
        if ($this.parent().is('.level1')) {
            $this.next('ul').find('[type=checkbox]').prop('checked', isChecked);
        } else {
            var $ul = $this.closest('ul');
            var isHaveChecked = $ul.find('[type=checkbox]').filter(function() {
                return $(this).prop('checked');
            }).length > 0;
            $ul.prev('.checkbox').find('[type=checkbox]').prop('checked', isHaveChecked);
        }
    });
    $( ".sortable" ).sortable({
        placeholder: "ui-state-highlight",
        revert: 200
    }).disableSelection();

    $('#btn_conf_save').on('click', function() {
        var data = [];
        $('.level1').each(function() {
            var $this = $(this);
            var $cb = $this.find('>.checkbox');
            if ($cb.find('[type=checkbox]').prop('checked')) {
                var obj = {
                    name: $cb.find('label').text()
                };
                var arr = [];
                $this.find('.level2').each(function() {
                    var $t = $(this);
                    if ($t.find('[type=checkbox]').prop('checked')) {
                        arr.push({
                            name: $(this).find('label').text()
                        });
                    }                    
                });
                if (arr.length > 0) {
                    obj.sub = arr;
                }
                data.push(obj);
            }
            
        });

        if (data.length > 0) {
            confUser.menu = data;
            tool.setConf(confUser);

            dialog.showMessageBox(win, {
                type: 'info',
                buttons: ['yes', 'no'],
                title: '系统提示',
                message: '配置完成，是否打开主界面？',
                icon: null
            }, function(index) {
                [function() {
                    ipc.send('open.main');
                }, function() {}][index]();
            });
        } else {
            dialog.showMessageBox(win, {
				type: 'info',
				buttons: ['yes'],
				title: '系统提示',
				message: "请选中要添加的产品！",
				icon: null
			});
        }
    });

    win.show();
}()