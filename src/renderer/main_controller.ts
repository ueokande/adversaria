///<reference path='../browser/note.ts'/>

var remote = require('remote')
var Note = remote.require('../browser/note');
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
    Note.load(file, (err, loaded) => {
      this.$scope.current_note.title = loaded.title();
      this.$scope.current_note.markdown = loaded.markdownAsHtml();
      this.$scope.current_note.path = loaded.fileName();
    });
  }
}
