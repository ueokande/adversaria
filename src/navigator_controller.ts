///<reference path='views/components/navigator/navigator.ts'/>

import * as path from 'path';
import * as fs from 'fs';

export default class NavigatorController {
  private element: NavigatorElement;
  private base_dir: string;
  private relative_path: string;

  constructor() {
    this.element = <NavigatorElement>document.getElementById('navigator');
    this.element.addEventListener('file_click', (e: any) => {
      var fullpath = path.join(this.base_dir, this.relative_path, e.detail.filename);
      var event = new CustomEvent('adv.file_select', {
        detail: { fullpath: fullpath }
      });
      window.dispatchEvent(event);
    });
    this.element.addEventListener('directory_click', (e: any) => {
      this.selectDirectory(e.detail.directory);
    });
  }

  setProjectPath(base_dir: string): void {
    this.base_dir = base_dir;
    this.relative_path = '/';
    this.selectDirectory('.');
  }

  selectDirectory(dir): void {
    this.relative_path = path.join(this.relative_path, dir);
    this.update()
  }

  update(): void {
    this.element.clearItems();
    this.element.setParentButton(this.relative_path != '/')

    var project_full_path = path.join(this.base_dir, this.relative_path);
    fs.readdir(project_full_path, (err, file_list) => {
      var file_list = file_list.filter((name) => { return !/^\./.test(name) });
      file_list.forEach((file) => {
        var full_path = path.join(project_full_path, file);
        var basename = path.basename(file);
        var stats = fs.statSync(full_path);
        if (stats.isDirectory()) {
          this.element.addItem(basename, 'directory');
        } else if (stats.isFile() && /\.md$/.test(full_path)) {
          this.element.addItem(basename, 'file');
        }
      });
    });
  }
}
