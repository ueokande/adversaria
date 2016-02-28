
const fs = require("fs");
const path = require("path");

export default function walkDirectories(baseDir: string): Promise<any> {
  "use strict";
  return Promise.resolve().then(function(): {[key: string]: any} {
    let walk = function(dirs: string[]): {[key: string]: any} {
      let results = {};
      let dirStr = path.join.apply(this, dirs);
      let list = fs.readdirSync(dirStr);
      list = list.filter((name) => { return !/^\./.test(name); });
      list.forEach(function(file: string): void {
        let catFile = dirs.concat([file]);
        let stat = fs.statSync(path.join.apply(this, catFile));
        if (!stat.isDirectory()) { return; }
        results[file] = walk(catFile);
      });
      return results;
    };

    let parsed = path.parse(baseDir);
    let array;
    if (parsed.root.length === 0) {
      array = path.join(parsed.dir, parsed.base).split("/");
    } else {
      array = ["/"].concat(path.join(parsed.dir, parsed.base).split("/"));
      array.splice(1, 1);
    }
    return walk(array);
  });
}
