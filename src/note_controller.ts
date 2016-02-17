///<reference path='views/components/note-view/note-view.ts'/>

import Note from './note';
import * as path from 'path';
import * as chokidar from 'chokidar';

export default class NoteController {
  private current_file: string;
  private watcher: any;

  constructor() {
    var noteView = <NoteViewElement>document.getElementById('note-view')
    noteView.title = 'Hello adversaria';
    noteView.body = '# What is adversaria\nRefer [repository](https://github.com/ueokande/adversaria)>.';
    noteView.path = '';
  }

  open(fullpath): void {
    this.current_file = fullpath;;
    Note.load(fullpath, (err, loaded) => {
      var noteView = <NoteViewElement>document.getElementById('note-view')
      noteView.title = loaded.title;
      noteView.body = loaded.markdownAsHtml();
      noteView.path = loaded.fileName();
    });

    if (this.watcher) { this.watcher.close(); }
    this.watcher = chokidar.watch(fullpath, { persistent: true });
    this.watcher.on('change', () => {
      var event = new CustomEvent('adv.project.changed');
      this.open(fullpath);
    });
  }

  currentFile(): string {
    return this.current_file;
  }
}
