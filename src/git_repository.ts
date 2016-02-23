const NodeGit = require('nodegit');

export default class GitRepository {
  private cert;

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

  setCredFromSSHKey(public_key: string, private_key: string, passphrase: string): Promise<any> {
    return this.setCredFromCallback(function(url, username) {
      return NodeGit.Cred.sshKeyNew(username, public_key, private_key, passphrase);
    });
  }

  setCredFromSSHAgent(): Promise<any> {
    return this.setCredFromCallback(function(url, username) {
      return NodeGit.Cred.sshKeyFromAgent();
    });
  }

  private setCredFromCallback(cert_callback: Function): Promise<any> {
    var remote;
    return NodeGit.Repository.open(this.repository_path).then(function(repository) {
      return repository.getRemote('origin');
    })
    .then((_remote) => {
      remote = _remote;
      this.cert = cert_callback;
      return remote.connect(NodeGit.Enums.DIRECTION.FETCH, {
        certificateCheck: () => { return 1; },
        credentials: cert_callback
      });
    });
  }
}
