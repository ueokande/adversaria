import GitRepository from "./git_repository";

export default class Project {
  private repo: GitRepository;

  constructor(private _path: string) {
    this.repo = new GitRepository(_path);
  }

  get repository(): GitRepository {
    return this.repo;
  }

  get path(): string {
    return this._path;
  }
}
