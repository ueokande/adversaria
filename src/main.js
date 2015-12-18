'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');

require('crash-reporter').start();

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  var win = new BrowserWindow({width: 800, height: 600});
  win.loadUrl('file://' + __dirname + '/index.html');
  win.on('closed', function () {
    win = null;
  });
});
