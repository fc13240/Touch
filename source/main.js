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
	
	var conf = require('./package') || {};
	var path_user = path.join(require('os').homedir(), 'BPA', 'TOUCH');
	conf.PATH = {
		USER: path_user,
		BASE: __dirname
	};

	var wins = [];
	function _showWin(opt, pathName) {
		opt.title = conf.title;
		var win = new BrowserWindow(opt);
		win.loadURL(path.join('file://' , __dirname, pathName));
		win._PACKAGE = conf;
		win.show();
		var temp;
		while((temp = wins.shift())) {
			temp.close();
		}
		wins.push(win);
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
			if (conf.debug) {
				delete opt.fullscreen;
				delete opt.autoHideMenuBar;
			}
			_showWin(opt, 'index.html');
		}
	}
	function _showConsole(data) {
		var opt = {
			width: 682,
			height: 512,
			show: false,
			autoHideMenuBar: true
		}
		data = JSON.stringify(data);
		return _showWin(opt, 'console.html'+(data? '#'+data: ''));
	}
	ipc.on('open.main', function() {
		_showMain();
	});
	ipc.on('open.console', function(e, data) {
		_showConsole(data);
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
