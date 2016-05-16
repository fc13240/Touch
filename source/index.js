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
    
    app.on('window-all-closed', function () {
		app.quit();
	});
	
	app.on('ready', function() {
		var opt = {
			width: 1000,
			height: 1000,
			show: false,
            fullscreen: true,
            autoHideMenuBar: true
		}
		var IS_DEBUG = false;
		try {
			var conf = require('./conf');
			if ((IS_DEBUG = conf.debug)) {
				delete opt.fullscreen;
				delete opt.autoHideMenuBar;
			}
		} catch(e) {}
		var win = new BrowserWindow(opt);
		var content = win.webContents;

		content.on('dom-ready', function() {
			content.executeJavaScript('var PACKAGE = '+(conf? JSON.stringify(conf):'null'));
		});

		globalShortcut.register('Alt+Shift+i', function() {
            win.openDevTools();
        });
		
		
		win.loadURL(path.join('file://' , __dirname, 'index.html'));
		win.show();
	});

	// 启动处理缓存和日志文件的子进程
	require('child_process').fork(path.join(__dirname, 'cache'));
}();
