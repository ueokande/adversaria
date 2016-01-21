///<reference path='user_settings_dialog.ts'/>
///<reference path='components/navigator/navigator.ts'/>

var remote = require('remote');
var fs = require('fs');
var path = require('path');
var settings = require('../browser/user_settings')
var externalEditor = require('./../browser/external_editor');
var NoteController = require('./note_controller');
var NavigatorController = require('./navigator_controller');

var noteController;

window.onload = () => {
  var document_path = settings.loadDocumentPath();
  if (!document_path) {
    UserSettingsDialog.show();
  }

  noteController = new NoteController;

  var navigatorController = new NavigatorController;
  navigatorController.setDocumentPath(document_path);
  navigatorController.onFileSelect(function(filename, fullpath) {
    noteController.open(fullpath);
  });
}

window.onkeypress = (e) => {
  if (e.keyCode == 101) { // e
    var path = noteController.currentFile();
    if (path && path.length == 0) {
      return true;
    }
    externalEditor.open(path)
  }
}
