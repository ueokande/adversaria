import * as fs from 'fs';
import * as path from 'path';
const md = require('markdown-it')();
const emoji = require('markdown-it-emoji');

md.use(emoji);

export default class Note {
  private markdown_as_html: string;

  constructor(private file_name: string) {
  }

  static load(path, cb): void {
    fs.readFile(path, 'utf-8', (err, text) => {
      var note = new Note(path);
      note.markdown_as_html = md.render(text);
      cb(err, note);
    });
  }

  fileName(): string {
    return this.file_name;
  }

  get title(): string {
    return path.basename(this.file_name)
      .replace(/_/g, ' ')
      .replace(/.md$/, '');
  }

  markdownAsHtml(): string {
    return this.markdown_as_html;
  }
}
