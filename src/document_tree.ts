import * as fs from 'fs';
import * as path from 'path';

export enum FileType { Directory, Note };

export class DocumentTree {
  private current_dir: string;
  private root_dir: string;

  constructor(root_dir: string) {
    this.root_dir = path.join(root_dir);
    this.current_dir = this.root_dir;
  }

  list(callBack): void {
    fs.readdir(this.current_dir, (err, file_list) => {
      var file_list = file_list.filter((name) => { return !/^\./.test(name) });
      file_list.forEach((file) => {
        var full_path = path.join(this.current_dir, file);
        var stats = fs.statSync(full_path);
        if (stats.isDirectory()) {
          callBack(full_path, FileType.Directory);
        } else if (stats.isFile() && /\.md$/.test(full_path)) {
          callBack(full_path, FileType.Note);
        }
      });
    });
  }

  currentDir(): string {
    return this.current_dir;
  }

  enter(dir: string): void {
    this.current_dir = path.join(this.current_dir, dir);
  }

  isRootDirectory(): boolean {
    return this.root_dir == this.current_dir;
  }

  fullPathOf(file: string): string {
    return path.join(this.current_dir, file);
  }
}
