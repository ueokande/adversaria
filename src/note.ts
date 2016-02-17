import * as fs from 'fs';
import * as path from 'path';
const md = require('markdown-it')();
const emoji = require('markdown-it-emoji');
const frontMatter = require('front-matter');

md.use(emoji);

export default class Note {
  private attributes: any;
  private content: string;
  private file_name: string

  constructor() {
  }

  static load(path, cb): void {
    fs.readFile(path, 'utf-8', (err, text) => {
      var content = frontMatter(text);
      var note = new Note();
      note.file_name = path;
      note.attributes = content.attributes;
      note.content = content.body;
      cb(err, note);
    });
  }

  fileName(): string {
    return this.file_name;
  }

  get title(): string {
    if('title' in this.attributes) {
      return this.attributes.title;
    } else {
      return path.basename(this.file_name)
        .replace(/_/g, ' ')
        .replace(/.md$/, '');
    }
  }

  get body(): string {
    return this.content;
  }

  markdownAsHtml(): string {
    return md.render(this.content);
  }
}
