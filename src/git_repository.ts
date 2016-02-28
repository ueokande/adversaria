const NodeGit = require("nodegit");

export default class GitRepository {
  private cert: any;

  constructor(private repositoryPath: string) {
  }

  public path(): string {
    return this.repositoryPath;
  }

  public commit_all_changes(): Promise<any> {
    let index, treeOid, repository;

    return NodeGit.Repository.open(this.repositoryPath)
      .then((_) => {
        repository = _;
        return repository.openIndex();
      })
      .then((_) => {
        index = _;
        return index.addAll();
      })
      .then(() => {
        index.write();
        return index.writeTree();
      })
      .then((_) => {
        treeOid = _;
        return repository.getHeadCommit();
      })
      .then((head) => {
        let sign = NodeGit.Signature.default(repository);
        return repository.createCommit(
            "HEAD", sign, sign,
            "Update", treeOid, head ? [head] : []);
      });
  }

  public setCredFromSSHKey(publicKey: string, privateKey: string, passphrase: string): Promise<any> {
    return this.setCredFromCallback((url: string, username: string) => {
      return NodeGit.Cred.sshKeyNew(username, publicKey, privateKey, passphrase);
    });
  }

  public setCredFromSSHAgent(): Promise<any> {
    return this.setCredFromCallback((url: string, username: string) => {
      return NodeGit.Cred.sshKeyFromAgent(username);
    });
  }

  private setCredFromCallback(certCallback: Function): Promise<any> {
    let remote;
    return NodeGit.Repository.open(this.repositoryPath).then((repository) => {
      return repository.getRemote("origin");
    })
    .then((_remote) => {
      remote = _remote;
      this.cert = certCallback;
      return remote.connect(NodeGit.Enums.DIRECTION.FETCH, {
        certificateCheck: (): number => { return 1; },
        credentials: certCallback
      });
    });
  }
}
