///<reference path='views/components/navigator/navigator.ts'/>

import * as path from 'path';
import * as fs from 'fs';
import walkDirectory from './walk_directory';

export default class NavigatorController {
  private element: NavigatorElement;
  private base_dir: string;
  private relative_path: string;

  constructor() {
    this.element = <NavigatorElement>document.getElementById('navigator');
    this.element.addEventListener('directory_click', (e: any) => {
      var fullpath = path.join(this.base_dir, e.detail.directory);
      var event = new CustomEvent('adv.directory_select', {
        detail: { fullpath: fullpath }
      });
      window.dispatchEvent(event);
    });
  }

  setProjectPath(base_dir: string): void {
    this.base_dir = base_dir;
    this.element.clearItems();
    walkDirectory(this.base_dir).then((tree) => {
      this.element.setDirectoryTree(tree);
    });
  }
}
