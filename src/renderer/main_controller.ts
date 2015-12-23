var remote = require('remote');
var fs = require('fs');
var path = require('path');

interface MainScope extends ng.IScope {
  current_directory: string;
  current_file: string;
  current_note: any;
  file_items: any[];

  select_directory: Function;
  select_file: Function;
}

export = class MainController {
  constructor(private $scope: MainScope) {
    $scope.select_directory = angular.bind(this, this.select_directory);
    $scope.select_file = angular.bind(this, this.select_file);

    this.$scope.current_directory = '/';
    this.$scope.current_file = '';
    this.$scope.current_note = {
      title: 'Hello adversaria',
      markdown: '# What is adversaria\nRefer [repository](https://github.com/ueokande/adversaria)>.',
      path: ''
    };
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
        } else if (stats.isFile()) {
          this.$scope.file_items.push({name: file, file: true});
        }
      });
      this.$scope.$apply();
    });
  }

  select_file(file): void {
    this.$scope.current_note.title = file;
    this.$scope.current_note.markdown = file + " is on previewing!!";
    this.$scope.current_note.path = path.join(this.$scope.current_directory, file);
  }
}
