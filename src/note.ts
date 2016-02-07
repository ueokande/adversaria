var md = require('markdown-it')();
var emoji = require('markdown-it-emoji');
var fs = require('fs');
var path = require('path');

md.use(emoji);

export = class Note {
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

  title(): string {
    return path.basename(this.file_name)
      .replace(/_/g, ' ')
      .replace(/.md$/, '');
  }

  markdownAsHtml(): string {
    return this.markdown_as_html;
  }
}
