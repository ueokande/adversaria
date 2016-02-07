const NodeGit = require('nodegit');

export default class GitControl {
  constructor(private repository_path: string) {
  }

  path(): string {
    return this.repository_path;
  }

  commit_all_changes(): Promise<any> {
    var index, treeOid, repository;

    return NodeGit.Repository.open(this.repository_path)
      .then((_) => {
        repository = _;
        return repository.openIndex();
      })
      .then((_) => {
        index = _;
        return index.addAll()
      })
      .then(() => {
        index.write();
        return index.writeTree();
      })
      .then((_) => {
        treeOid = _;
        return repository.getHeadCommit()
      })
      .then((head) => {
        var sign = NodeGit.Signature.default(repository);
        return repository.createCommit(
            "HEAD", sign, sign,
            'Update', treeOid, head ? [head] : []);
      })
  }

}
