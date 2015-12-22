///<reference path='../../typings/user_defined/html_dialog_element.d.ts'/>

var remote = require('remote')
var dialog = remote.require('dialog');
var settings = remote.require('../browser/user_settings');

namespace UserSettingsDialog {

  export function close() {
    var dialog = <HTMLDialogElement>document.getElementById('user_settings_dialog');
    dialog.close();
  }

  export function show() {
    var dialog = <HTMLDialogElement>document.getElementById('user_settings_dialog');
    dialog.showModal();
  }

  export function showDirectoryDialog() {
    var options = {
      title: 'Choose directory of documents',
      properties: ['openDirectory']
    };
    dialog.showOpenDialog(options, function(filenames) {
      var input = (<HTMLInputElement>document.getElementById('documentDirectory'));
      input.value = filenames[0];
      settings.saveDocumentPath(filenames[0]);
    });
  }
}