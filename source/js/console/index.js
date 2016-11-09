!function() {
    var electron = require('electron');
    var shell = electron.shell;
    var remote = electron.remote;
    var dialog = remote.require('electron').dialog;
    var win = remote.getCurrentWindow();
    var ipc = electron.ipcRenderer;
    var URL_LOGIN = 'http://bpa.tianqi.cn/user/login';
    var URL_GET_MENU = 'http://bpa.tianqi.cn/user/touch/menu';

    $('tab item').on('click', function() {
        var $this = $(this);
        $('#'+$this.data('for')).css({
            display: 'block'
        }).siblings().hide();
        $this.addClass('on').siblings().removeClass('on');
    }).filter('.on').first().click();

    var _alert = function(msg) {
        dialog.showMessageBox(win, {
            type: 'info',
            buttons: ['yes'],
            title: '系统提示',
            message: msg,
            icon: null
        });
    }
    var Cache = {
        get: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        set: function(key, val) {
            localStorage.setItem(key, JSON.stringify(val));
        }
    }
    
    var tool = require('./js/console/tool');
    var confUser = tool.getConf() || {};
    var menuMixtureLocal = tool.mixtureMenu(confUser.menu, true);
    var menuMixtureRemote = tool.mixtureMenu(confUser.menuRemote, true);

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

    var $wrap_product = $('.wrap_product');
    // 对checkbox的点击事件进行处理
    $wrap_product.delegate('.checkbox', 'click', function() {
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
    $wrap_product.delegate('.remote', 'click', function() {
        _alert('远程配置请在远程后台管理里操作！');
    });
    function _bindData(menu, opt) {
        opt = $.extend(true, {}, opt);
        // 绑定数据并显示
        var html = '<ul class="p_list sortable '+(opt.className || '')+'">';
        menu.forEach(function(v) {
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
        html += '</ul>';

        $wrap_product.append(html);
        if (opt.canSort) {
            $( ".sortable" ).sortable({
                placeholder: "ui-state-highlight",
                revert: 200
            }).disableSelection();
        }

        return $(html);
    }
    
    var $cb_use_remote_menu = $('#cb_use_remote_menu');
    function _initShow() {
        var isUseRemote = confUser.remote;
        $cb_use_remote_menu.prop('checked', isUseRemote);

        if (isUseRemote) {
            $wrap_product.addClass('useRemote');
        } else {
            $wrap_product.removeClass('useRemote');
        }
    }
    _bindData(menuMixtureLocal, {
        canSort: true,
        className: 'local'
    });
    _bindData(menuMixtureRemote, {
        className: 'remote'
    });
    _initShow()

    $('#btn_conf_save').on('click', function() {
        var data = [];
        $('.'+(confUser.remote? 'remote': 'local')+' .level1').each(function() {
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
            _alert("请选中要添加的产品！");
        }
    });

    // 打开远程注册
    $('#btnRegister').on('click', function() {
        shell.openItem($(this).attr('href'));
        return false;
    });

    // 登录按钮
    var $userEmail = $('#userEmail'),
        $userPwd = $('#userPwd'),
        $wrap_user = $('.wrap_user'),
        $loginedInfo = $('.loginedInfo');
    
    var NAME_CACHE_USER = 'user';
    var userCache = Cache.get(NAME_CACHE_USER);
    if (userCache) {
        var _email = userCache.email;
        var _pwd = userCache.pwdM;
        $userEmail.val(_email);
        $userPwd.val(_pwd);

        _login(_email, _pwd);
    }
    var isLogining = false;    
    $('#btnReLogin').on('click', function() {
        $loginedInfo.hide().find('.info').remove();
        $wrap_user.show();
    });
    function _login(email, pwd, cbFail) {
        isLogining = true;
        $.post(URL_LOGIN, {
            type: 'client',
            username: email,
            pwd: pwd
        }, function(result) {
            if (result && result.code == 200) {
                $wrap_user.hide();
                var user = result.user;
                user.pwdM = pwd;
                Cache.set(NAME_CACHE_USER, user);
                var html = '<div class="info">新爱的用户：'+user.username+'，您的邮箱为'+user.email+'，联系电话为'+user.telphone;
                html += '，我们会为您提供最好的服务！</div>';
                
                $loginedInfo.prepend(html).show();

                $.get(URL_GET_MENU, {
                    type: 'client'
                }, function(result) {
                    if (result && result.code == 200) {
                        var menu = result.menu;
                        confUser.menuRemote = menu;
                        tool.setConf(confUser);

                        $('.remote').remove();
                        menu = tool.mixtureMenu(menu, true);
                        _bindData(menu, {
                            className: 'remote new'
                        });
                        _initShow();
                    }
                });
            } else {
                cbFail && cbFail();
            }
            isLogining = false;
        });
    }
    $('#btnLogin').on('click', function() {
        if (isLogining) {
            return;
        }
        var email = $userEmail.val();
        var errMsg = [];
        if (!email) {
            errMsg.push('邮箱不可为空！');
        }
        var pwd = $userPwd.val();
        if (!pwd) {
            errMsg.push('密码不可为空!');
        }


        if (errMsg.length > 0) {
            _alert(errMsg.join('\n'));
        } else {
            _login(email, pwd, function() {
                _alert('用户名或密码错误，请重新输入！');
            });
        }
    });

    var $cb_use_remote_menu = $('#cb_use_remote_menu');
    $('.cb_menu').on('click', function() {
        var isUseRemote = $cb_use_remote_menu.prop('checked');
        confUser.remote = isUseRemote;

        _initShow();
    });
    win.show();
}()