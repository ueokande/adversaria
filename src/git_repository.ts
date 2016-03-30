import * as NodeGit from "nodegit";

export default class GitRepository {
  private cred: any;

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

  public hasValidCred(): boolean {
    return this.cred !== undefined;
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

  private setCredFromCallback(credCallback: Function): Promise<any> {
    let cred;
    return NodeGit.Repository.open(this.repositoryPath)
    .then((repository) => {
      return repository.getRemote("origin");
    })
    .then((remote) => {
      return remote.connect(NodeGit.Enums.DIRECTION.FETCH, {
        certificateCheck: (): number => { return 1; },
        credentials: (url: string, username: string): any => {
          cred = credCallback(url, username);
          return cred;
        }
      });
    })
    .then(() => {
      this.cred = cred;
    });
  }
}
