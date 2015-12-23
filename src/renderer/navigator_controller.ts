var fs = require('fs');
var path = require('path');

interface MainScope extends ng.IScope {
  current_directory: string;
  file_items: any[];

  select_directory: Function;
}

export = class MainController {
  constructor(private $scope: MainScope) {
    $scope.select_directory = angular.bind(this, this.select_directory);

    this.$scope.current_directory = '/';
  }

  select_directory(dir): void{
    var next_path = path.join(this.$scope.current_directory, dir);
    this.$scope.current_directory = next_path;
    this.$scope.file_items = [];
    fs.readdir(next_path, (err, file_list) => {
      file_list = file_list.filter((name) => { return !/^\./.test(name) });
      file_list.forEach((file) => {
        var full_path = path.join(this.$scope.current_directory, file);
        var stats = fs.statSync(full_path);
        if (stats.isDirectory()) {
          this.$scope.file_items.push({name: file, directory: true});
        } else if (stats.isFile() && /\.md$/.test(full_path)) {
          this.$scope.file_items.push({name: file, file: true});
        }
      });
      this.$scope.$apply();
    });
  }
}
