///<reference path="views/components/note-view/note-view.ts"/>

import Note from "./note";
import * as chokidar from "chokidar";

export default class NoteController {
  private _currentFile: string;
  private watcher: any;

  constructor() {
    let noteView = <NoteViewElement>document.getElementById("note-view");
    noteView.title = "Hello adversaria";
    noteView.body = "# What is adversaria\nRefer [repository](https://github.com/ueokande/adversaria)>.";
    noteView.path = "";
  }

  public open(fullpath: string): void {
    this._currentFile = fullpath;
    Note.load(fullpath, (err, loaded) => {
      let noteView = <NoteViewElement>document.getElementById("note-view");
      noteView.title = loaded.title;
      noteView.body = loaded.markdownAsHtml();
      noteView.path = loaded.fileName;
    });

    if (this.watcher) { this.watcher.close(); }
    this.watcher = chokidar.watch(fullpath, { persistent: true });
    this.watcher.on("change", () => {
      let event = new CustomEvent("adv.project.changed");
      this.open(fullpath);
      window.dispatchEvent(event);
    });
  }

  public currentFile(): string {
    return this._currentFile;
  }
}
