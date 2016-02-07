///<reference path='note.ts'/>
///<reference path='views/components/note-view/note-view.ts'/>

var Note = require('./note');
var path = require('path');

export = class NoteController {
  private current_file: string;

  constructor() {
    var noteView = <NoteViewElement>document.getElementById('note-view')
    noteView.title = 'Hello adversaria';
    noteView.body = '# What is adversaria\nRefer [repository](https://github.com/ueokande/adversaria)>.';
    noteView.path = '';
  }

  open(file): void {
    this.current_file = file;;
    Note.load(file, (err, loaded) => {
      var noteView = <NoteViewElement>document.getElementById('note-view')
      noteView.title = loaded.title();
      noteView.body = loaded.markdownAsHtml();
      noteView.path = loaded.fileName();
    });
  }

  currentFile(): string {
    return this.current_file;
  }
}
