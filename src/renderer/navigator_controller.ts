///<reference path='components/navigator/navigator.ts'/>

var fs = require('fs');
var path = require('path');

export = class NavigatorController {
  private rootDirectory: string;
  private currentDirectory: string;
  private fileSelectCallback: Function;
  private controller: NavigatorController;

  constructor() {
    this.controller = this;
    var element = <NavigatorElement>document.getElementById('navigator');
    element.onFileClick((filename) => {
      if (this.fileSelectCallback) { this.fileSelectCallback(filename) }
    });
    element.onDirectoryClick((dirname) => {
      this.selectDirectory(dirname);
    });
  }

  setRootDirectory(dir: string) {
    this.rootDirectory = dir;
    this.currentDirectory = dir;
    this.selectDirectory('.');
  }

  onFileSelect(callback: Function) {
    this.fileSelectCallback = callback;
  }

  selectDirectory(dir): void {
    var navigator = <NavigatorElement>document.getElementById('navigator');
    var next_path = path.join(this.currentDirectory, dir);
    this.currentDirectory = next_path;
    navigator.clearItems();
    navigator.setParentButton(!this.isRootDirectory());
    fs.readdir(next_path, (err, file_list) => {
      file_list = file_list.filter((name) => { return !/^\./.test(name) });
      file_list.forEach((file) => {
        var full_path = path.join(this.currentDirectory, file);
        var stats = fs.statSync(full_path);
        if (stats.isDirectory()) {
          navigator.addItem(file, FileType.Directory);
        } else if (stats.isFile() && /\.md$/.test(full_path)) {
          navigator.addItem(file, FileType.File);
        }
      });
    });
  }

  selectParentDirectory(): void {
    this.selectDirectory('..');
  }

  isRootDirectory(): boolean {
    return this.rootDirectory && (this.rootDirectory == this.currentDirectory)
  }

  fullPathOf(file: string): string {
    return path.join(this.currentDirectory, file);
  }
}
