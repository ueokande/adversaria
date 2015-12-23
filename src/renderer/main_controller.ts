var remote = require('remote')
var mdUtils = remote.require('../browser/md_utils');
var path = require('path');

interface MainScope extends ng.IScope {
  current_file: string;
  current_note: any;

  select_file: Function;
}

export = class MainController {
  constructor(private $scope: MainScope) {
    $scope.select_file = angular.bind(this, this.select_file);

    this.$scope.current_file = '';
    this.$scope.current_note = {
      title: 'Hello adversaria',
      markdown: '# What is adversaria\nRefer [repository](https://github.com/ueokande/adversaria)>.',
      path: ''
    };
  }

  select_file(file): void {
    this.$scope.current_note.title = path.basename(file);
    this.$scope.current_note.markdown = mdUtils.readAsHtml(file);
    this.$scope.current_note.path = file
  }
}
