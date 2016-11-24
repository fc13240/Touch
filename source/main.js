/* global process */
/* global global */
/* global __dirname */
!function(){
	// "use strict";

	var path = require('path');
	var electron = require('electron');
	var app = electron.app;
	var BrowserWindow = electron.BrowserWindow;
    var globalShortcut = electron.globalShortcut;
	var ipc = electron.ipcMain;
	var toolConsole = require('./js/console/tool');
    
    app.on('window-all-closed', function () {
		app.quit();
	});
	
	var conf = require('./common/tool').CONF;
	process._PACKAGE = conf;

	var win_main;
	var win_console;
	// var wins = [];
	function _showWin(opt, pathName) {
		opt.title = conf.title;
		var win = new BrowserWindow(opt);
		win.loadURL(path.join('file://' , __dirname, pathName));
		win._PACKAGE = conf;
		win.show();
		// var temp;
		// while((temp = wins.shift())) {
		// 	temp.close();
		// }
		// wins.push(win);
		return win;
	}
	function _showMain() {
		if (!toolConsole.isHaveMenu()) {
			var win = _showConsole();
			electron.dialog.showMessageBox(win, {
				type: 'info',
				buttons: ['yes'],
				title: '系统提示',
				message: '请先进行系统配置！',
				icon: null
			}, function(index) {
				[function() {
					win.show();
				}][index]();
			});
		} else {
			var opt = {
				// width: 682,
				// height: 512,
				width: 1024,
				height: 768,
				show: false,
				fullscreen: true,
				autoHideMenuBar: true
			}
			// if (conf.debug) {
			// 	delete opt.fullscreen;
			// 	delete opt.autoHideMenuBar;
			// }
			win_main = _showWin(opt, 'index.html');
		}
	}
	function _showConsole(data) {
		var opt = {
			width: 682,
			height: 512,
			show: false,
			autoHideMenuBar: true,
			alwaysOnTop: true
		}
		data = JSON.stringify(data);
		win_console = _showWin(opt, 'console.html'+(data? '#'+data: ''));
		if (win_main) {
			function _rmListener() {
				win_main.removeListener('focus', _fn_focus);
			}
			function _fn_focus() {
				try {
					// win_main.blur();
					
					win_console.setAlwaysOnTop(true);
					win_console.restore();
					win_console.focus();
					win_console.setAlwaysOnTop(false);
					_shake(win_console);
				} catch(e) {
					console.log(e);
					_rmListener();
				}
			}
			win_main.on('focus', _fn_focus);
			win_console.on('close', _rmListener);
		}
	}
	// 晃动窗口
	function _shake(win) {
		if (win.___shake) {
			return;
		}
		var t = 0,
			z = 3;
		var pos = win.getPosition();
		var left = pos[0],
			top = pos[1];
		win.___shake = setInterval(function() {
			var i = t / 180 * Math.PI,
				x = Math.sin(i) * z,
				y = Math.cos(i) * z;
			win.setPosition(left + x, top + y);
			if ((t += 90) > 1080) {
				clearInterval(win.___shake);
				delete win.___shake;
			}
		}, 30);
	}
	// ipc.on('open.main', function() {
	// 	_showMain();
	// });
	ipc.on('open.console', function(e, data) {
		_showConsole(data);
	});
	ipc.on('console.save', function() {
		win_main && win_main.send('console.save');
	});
	app.on('ready', function() {
		_showMain();
		globalShortcut.register('Alt+Shift+i', function() {
            var win = BrowserWindow.getFocusedWindow();
			win && win.openDevTools();
        });
	});

	// 启动处理缓存和日志文件的子进程
	require('child_process').fork(path.join(__dirname, 'cache'));
}();
