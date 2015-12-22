///<reference path='../../typings/tsd.d.ts'/>

var remote = require('remote');
var fs = require('fs');
var path = require('path');
var ngModule = angular.module('adversaria', []);
var settings = remote.require('../browser/user_settings');
require('./user_settings_dialog');

ngModule.controller('MainController', function () {
  var main = this;

  main.current_directory = '/';
  main.current_file = '';
  main.current_note = {
    title: 'Hello adversaria',
    markdown: '# What is adversaria\nRefer [repository](https://github.com/ueokande/adversaria)>.',
    path: ''
  };

  this.select_directory = (dir) => {
    var next_path = path.join(main.current_directory, dir);
    main.current_directory = next_path;
  }

  this.select_file = (file) => {
    main.current_note.title = file;
    main.current_note.markdown = file + " is on previewing!!";
    main.current_note.path = path.join(main.current_directory, file);
  }

  main.file_items = [
    { name: 'install_adversaria.md', file: true },
    { name: 'usage.md', file: true },
    { name: 'Directory 1', directory: true },
  ];
});

ngModule.directive('mdPreview', () => {
  return ($scope, $elem, $attrs) => {
    $scope.$watch($attrs.mdPreview, (source) => {
      $elem.html(source);
    });
  };
});

window.onload = () => {
  if (!settings.loadDocumentPath()) {
    UserSettingsDialog.show();
  }
}
