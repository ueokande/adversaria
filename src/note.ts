import * as fs from "fs";
import * as path from "path";
const md = require("markdown-it")();
const emoji = require("markdown-it-emoji");
const frontMatter = require("front-matter");

md.use(emoji);

export default class Note {
  private attributes: any;
  private content: string;
  private _fileName: string;

  constructor() {
  }

  public static load(path: string, cb: Function): void {
    fs.readFile(path, "utf-8", (err, text) => {
      let content = frontMatter(text);
      let note = new Note();
      note._fileName = path;
      note.attributes = content.attributes;
      note.content = content.body;
      cb(err, note);
    });
  }

  get fileName(): string {
    return this._fileName;
  }

  get title(): string {
    if ("title" in this.attributes) {
      return this.attributes.title;
    } else {
      return path.basename(this._fileName)
        .replace(/_/g, " ")
        .replace(/.md$/, "");
    }
  }

  get body(): string {
    return this.content;
  }

  public markdownAsHtml(): string {
    return md.render(this.content);
  }
}
