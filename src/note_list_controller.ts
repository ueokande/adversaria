///<reference path='views/components/note-list/note-list.ts'/>

import * as fs from 'fs';
import * as path from 'path';

export default class NoteListController {
  private element: NoteListElement;
  private base_dir: string;

  constructor() {
    this.element = <NoteListElement>document.getElementById('note-list');
    this.element.addEventListener('item_click', (e: any) => {
      var fullpath = path.join(this.base_dir, e.detail.filename);
      var event = new CustomEvent('adv.file_select', {
        detail: { fullpath: fullpath }
      });
      window.dispatchEvent(event);
    });
  }

  setNoteListDirectory(base_dir: string): void {
    this.base_dir = base_dir;
    this.update();
  }

  update(): void {
    this.element.clearItems();

    fs.readdir(this.base_dir, (err, file_list) => {
      if (err) { throw err; }

      var file_list = file_list.filter((name) => { return !/^\./.test(name) });
      file_list.forEach((file) => {
        var full_path = path.join(this.base_dir, file);
        var basename = path.basename(file);
        var stats = fs.statSync(full_path);
        if (stats.isFile() && /\.md$/.test(full_path)) {
          this.element.addItem(basename, 'file');
        }
      });
    });
  }
}
