///<reference path='../browser/note.ts'/>
///<reference path='components/path-view/path-view.ts'/>
///<reference path='components/note-view/note-view.ts'/>

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
    var noteView = <NoteViewElement>document.getElementById('note-view')
    noteView.title = 'Hello adversaria';
    noteView.body = '# What is adversaria\nRefer [repository](https://github.com/ueokande/adversaria)>.';
    noteView.path = '';
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
      var noteView = <NoteViewElement>document.getElementById('note-view')
      noteView.title = loaded.title();
      noteView.body = loaded.markdownAsHtml();
      noteView.path = loaded.fileName();
    });
  }
}
