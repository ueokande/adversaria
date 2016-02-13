import * as fs from 'fs';
import GitRepository from './git_repository'

export default class Project {

  private repo: GitRepository;

  constructor(private _path: string) {
    this.repo = new GitRepository(_path);
  }

  get repository() {
    return this.repo;
  }

  get path() {
    return this._path;
  }
}
