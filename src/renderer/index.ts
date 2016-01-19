///<reference path='user_settings_dialog.ts'/>

var remote = require('remote');
var fs = require('fs');
var path = require('path');
var settings = require('../browser/user_settings')
var externalEditor = require('./../browser/external_editor');
var MainController = require('./main_controller');
var NavigatorController = require('./navigator_controller');
var ngModule = angular.module('adversaria', []);

ngModule.controller('MainController', ['$scope', MainController]);
ngModule.controller('NavigatorController', ['$scope', NavigatorController]);

ngModule.directive('mdPreview', () => {
  return ($scope, $elem, $attrs) => {
    $scope.$watch($attrs.mdPreview, (source) => {
      $elem.html(source);
    });
  };
});

window.onload = () => {
  var document_path = settings.loadDocumentPath();
  if (!document_path) {
    UserSettingsDialog.show();
  }
  var scope: any = angular.element(document.getElementById('navigator')).scope();
  scope.setRootDirectory(document_path);
}

window.onkeypress = (e) => {
  if (e.keyCode == 101) { // e
    var scope = <any>angular.element(document.body).scope();
    var path = scope.current_note.path;
    console.debug(scope.current_note);
    if (scope.current_note.path.length == 0) {
      return true;
    }
    externalEditor.open(path)
  }
}
