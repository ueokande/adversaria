var NodeGit = require('nodegit');

export = class GitControl {
  constructor(private repository_path: string) {
  }

  path(): string {
    return this.repository_path;
  }
}
