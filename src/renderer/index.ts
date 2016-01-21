///<reference path='user_settings_dialog.ts'/>
///<reference path='components/navigator/navigator.ts'/>

var remote = require('remote');
var fs = require('fs');
var path = require('path');
var settings = require('../browser/user_settings')
var externalEditor = require('./../browser/external_editor');
var MainController = require('./main_controller');
var NavigatorController = require('./navigator_controller');
var ngModule = angular.module('adversaria', []);

ngModule.controller('MainController', ['$scope', MainController]);

ngModule.directive('mdPreview', () => {
  return ($scope, $elem, $attrs) => {
    $scope.$watch($attrs.mdPreview, (source) => {
      $elem.html(source);
    });
  };
});

window.onload = () => {
  var navigatorController = new NavigatorController;

  var document_path = settings.loadDocumentPath();
  if (!document_path) {
    UserSettingsDialog.show();
  }
  navigatorController.setRootDirectory(document_path);
  navigatorController.onFileSelect(function(filename) {
    var scope = <any>angular.element(document.body).scope();
    scope.select_file(navigatorController.fullPathOf(filename));
  });
}

window.onkeypress = (e) => {
  if (e.keyCode == 101) { // e
    var scope = <any>angular.element(document.body).scope();
    var path = scope.current_note.path;
    if (scope.current_note.path.length == 0) {
      return true;
    }
    externalEditor.open(path)
  }
}
