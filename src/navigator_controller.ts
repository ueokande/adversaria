///<reference path="views/components/navigator/navigator.ts"/>

import * as path from "path";
import walkDirectory from "./walk_directory";

export default class NavigatorController {
  private element: NavigatorElement;
  private baseDir: string;

  constructor() {
    this.element = <NavigatorElement>document.getElementById("navigator");
    this.element.addEventListener("directory_click", (e: any) => {
      let fullpath = path.join(this.baseDir, e.detail.directory);
      let event = new CustomEvent("adv.directory_select", {
        detail: { fullpath: fullpath }
      });
      window.dispatchEvent(event);
    });
  }

  public setProjectPath(baseDir: string): void {
    this.baseDir = baseDir;
    this.element.clearItems();
    walkDirectory(this.baseDir).then((tree) => {
      this.element.setDirectoryTree(tree);
    });
  }
}
