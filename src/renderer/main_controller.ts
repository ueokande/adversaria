///<reference path='../browser/note.ts'/>
///<reference path='components/path-view/path-view.ts'/>

var remote = require('remote')
var Note = remote.require('../browser/note');
var path = require('path');
import chokidar = require('chokidar');

interface MainScope extends ng.IScope {
  current_file: string;
  current_note: any;

  select_file: Function;
}

export = class MainController {
  private current_watcher: any;

  constructor(private $scope: MainScope) {
    this.$scope.select_file = angular.bind(this, this.select_file);
    this.$scope.current_file = '';
    this.$scope.current_note = {
      title: 'Hello adversaria',
      markdown: '# What is adversaria\nRefer [repository](https://github.com/ueokande/adversaria)>.',
      path: ''
    };
  }

  select_file(file): void {
    if (this.current_watcher) {
      this.current_watcher.close();
    }
    this.current_watcher = chokidar.watch(file, { persistent: true });
    this.current_watcher.on('change', this.reload_file);
    this.reload_file(file);
  }

  reload_file = (file: string) => {
    Note.load(file, (err, loaded) => {
      this.$scope.current_note.title = loaded.title();
      this.$scope.current_note.markdown = loaded.markdownAsHtml();
      this.$scope.current_note.path = loaded.fileName();
      var pathView = <PathViewElement> document.getElementById("path_view");
      pathView.path = loaded.fileName();
      this.$scope.$apply();
    });
  }
}
