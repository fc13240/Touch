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
    
    app.on('window-all-closed', function () {
		app.quit();
	});
	
	var conf = require('./conf') || {};
	var path_user = path.join(require('os').homedir(), 'BPA', 'TOUCH');
	conf.PATH = {
		USER: path_user
	};

	function _showWin(opt, pathName) {
		opt.title = conf.title;
		var win = new BrowserWindow(opt);
		var content = win.webContents;

		content.on('dom-ready', function() {
			content.executeJavaScript('var PACKAGE = '+(conf? JSON.stringify(conf):'null'));
		});

		win.loadURL(path.join('file://' , __dirname, pathName));
		return win;
	}
	function _showMain() {
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

		return _showWin(opt, 'index.html');
	}
	function _showConsole() {
		var opt = {
			width: 682,
			height: 512,
			show: false
		}
		return _showWin(opt, 'console.html');
	}
	function _closeAll() {
		BrowserWindow.getAllWindows().forEach(function(win) {
			win.close();
		});
	}
	ipc.on('open.main', function() {
		_closeAll();
		_showMain();
	});
	ipc.on('open.console', function() {
		_closeAll();
		_showConsole();
	});
	app.on('ready', function() {
		var toolConsole = require('./js/console/tool');
		if (!toolConsole.getConf()) {
			var win = _showConsole();
			electron.dialog.showMessageBox(win, {
				type: 'info',
				buttons: ['配置', '退出'],
				title: '系统提示',
				message: '请先进行系统配置！',
				icon: null
			}, function(index) {
				[function() {
					win.show();
				},
				function() {
					app.quit();
				}][index]();
			});
		} else {
			_showMain();
		}
		globalShortcut.register('Alt+Shift+i', function() {
            var win = BrowserWindow.getFocusedWindow();
			win && win.openDevTools();
        });
	});

	// 启动处理缓存和日志文件的子进程
	require('child_process').fork(path.join(__dirname, 'cache'));
}();
