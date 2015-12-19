import fs = require('fs');

export = class Note {
  private file_name: string;
  private file_content: string;

  constructor(file_name: string) {
    this.file_name = file_name;
    this.file_content = fs.readFileSync(file_name, 'utf-8');
  }

  get fileName(): string {
    return this.file_name;
  }

  get content(): string {
    return this.file_content;
  }
}
