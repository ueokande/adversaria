var fs = require('fs');
var path = require('path');

interface MainScope extends ng.IScope {
  current_directory: string;
  file_items: any[];

  selectDirectory: Function;
  selectParentDirectory: Function;
  setRootDirectory: Function;
  isRootDirectory: Function;
  fullPathOf: Function;
}

export = class MainController {
  private rootDirectory: string;

  constructor(private $scope: MainScope) {
    $scope.selectDirectory = angular.bind(this, this.selectDirectory);
    $scope.selectParentDirectory = angular.bind(this, this.selectParentDirectory);
    $scope.setRootDirectory = angular.bind(this, this.setRootDirectory);
    $scope.isRootDirectory = angular.bind(this, this.isRootDirectory);
    $scope.fullPathOf = angular.bind(this, this.fullPathOf);
    $scope.current_directory = null;
  }

  selectDirectory(dir): void {
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

  selectParentDirectory(): void {
    this.selectDirectory('..');
  }

  setRootDirectory(directory: string): void {
    this.rootDirectory = directory;
    this.$scope.current_directory = directory;
    this.selectDirectory('.');
  }

  isRootDirectory(): boolean {
    return this.rootDirectory && (this.rootDirectory == this.$scope.current_directory)
  }

  fullPathOf(file: string): string {
    return path.join(this.$scope.current_directory, file);
  }
}
