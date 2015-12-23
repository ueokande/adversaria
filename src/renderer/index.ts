///<reference path='user_settings_dialog.ts'/>

var remote = require('remote');
var fs = require('fs');
var path = require('path');
var settings = require('../browser/user_settings')
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
