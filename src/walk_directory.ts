var fs = require('fs');
var path = require('path');

export default function walkDirectories(base_dir) {
  return Promise.resolve().then(function() {
    var walk = function(dirs) {
      var results = {};
      var dirStr = path.join.apply(this, dirs);
      var list = fs.readdirSync(dirStr);
      list = list.filter(function (name) { return !/^\./.test(name) });
      list.forEach(function(file) {
        var catFile = dirs.concat([file]);
        var stat = fs.statSync(path.join.apply(this, catFile));
        if (!stat.isDirectory()) { return }
        results[file] = walk(catFile);
      });
      return results
    };

    var parsed = path.parse(base_dir);
    var array;
    if (parsed.root.length == 0) {
      array = path.join(parsed.dir, parsed.base).split('/');
    } else {
      array = ['/'].concat(path.join(parsed.dir, parsed.base).split('/'));
      array.splice(1,1);
    }
    return walk(array);
  });
}
