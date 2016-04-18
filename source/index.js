/* global process */
/* global global */
/* global __dirname */
!function(){
	// "use strict";

	var path = require('path');
	var app = require('app');
	var electron = require('electron');
	var BrowserWindow = require('browser-window');
    var globalShortcut = electron.globalShortcut;
    
    app.on('window-all-closed', function () {
		app.quit();
	});
	
	app.on('ready', function() {
		var opt = {
			width: 1000,
			height: 1000,
			show: true,
            fullscreen: true,
            autoHideMenuBar: true
		}
		try {
			var conf = require('./conf');
			if (conf.debug) {
				delete opt.fullscreen;
				delete opt.autoHideMenuBar;
			}
		} catch(e) {}
		var win = new BrowserWindow(opt);
		globalShortcut.register('Alt+Shift+i', function() {
            win.openDevTools();
        });
		win.loadURL(path.join('file://' , __dirname, 'index.html'));
		win.show();
	});
}();
