///<reference path="views/components/note-list/note-list.ts"/>

import * as fs from "fs";
import * as path from "path";
import Note from "./note";

export default class NoteListController {
  private element: NoteListElement;
  private baseDir: string;

  constructor() {
    this.element = <NoteListElement>document.getElementById("note-list");
    this.element.addEventListener("item_click", (e: any) => {
      let fullpath = path.join(this.baseDir, e.detail.filename);
      let event = new CustomEvent("adv.file_select", {
        detail: { fullpath: fullpath }
      });
      window.dispatchEvent(event);
    });
  }

  public setNoteListDirectory(baseDir: string): void {
    this.baseDir = baseDir;
    this.update();
  }

  public update(): void {
    this.element.clearItems();

    fs.readdir(this.baseDir, (err, fileList) => {
      if (err) { throw err; }

      fileList = fileList.filter((name) => { return !/^\./.test(name); });
      fileList.forEach((file) => {
        let fullPath = path.join(this.baseDir, file);
        let basename = path.basename(file);
        let stats = fs.statSync(fullPath);
        if (!stats.isFile() || ! /\.md$/.test(fullPath)) { return; }
        Note.load(fullPath, (_err, note: Note) => {
          this.element.addItem(basename, note.title, note.body);
        });
      });
    });
  }
}
