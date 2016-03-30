///<reference path="../typings/user_defined/nodegit.d.ts"/>

import GitRepository from "../build/git_repository";
import * as fs from "fs-extra";
import * as NodeGit from "nodegit";
import * as helper from "./test_helper";

describe("GitRepository class", () => {
  describe("#path", () => {
    it("returns repository path", () => {
      let git = new GitRepository("/tmp/my_document");
      assert.equal("/tmp/my_document", git.path());
    });
  });

  describe("#commit_all_changes", () => {
    let oid;
    before(function (): void {
      let git = new GitRepository("/tmp/my_document");
      fs.removeSync("/tmp/my_document/");
      fs.copySync(__dirname + "/../test/testdata/my_document",
                  "/tmp/my_document");
      return NodeGit.Repository.init("/tmp/my_document", 0)
        .then(() => { return git.commit_all_changes(); })
        .then((_) => { oid = _; });
    });

    after(() => {
      fs.removeSync("/tmp/my_document/");
    });

    it("returns oid", () => {
      assert.equal(oid.tostrS().length, 40);
    });

    it("commits all changes", () => {
      return NodeGit.Repository.open("/tmp/my_document")
        .then((repo) => { return repo.getStatus(); })
        .then((statuses) => {
          assert.equal(statuses.length, 0);
        });
    });

    it("contains file changes", () => {
      return NodeGit.Repository.open("/tmp/my_document")
        .then((repo) => { return repo.getHeadCommit(); })
        .then((commit) => { return commit.getEntry("api/users.md"); })
        .then((entry) => { assert.equal(entry.path(), "api/users.md"); });
    });
  });

  describe("#setCredFromSSHAgent", () => {
    before(() => {
      fs.mkdirSync("/tmp/remote-repository");
      return NodeGit.Repository.init("/tmp/remote-repository", 1)
      .then(() => {
        return NodeGit.Clone(
          `ssh://${process.env.USER}@localhost/tmp/remote-repository`,
          "/tmp/my_document", {
            fetchOpts: {
              callbacks: {
                credentials: (url: string, username: string): any => {
                  return NodeGit.Cred.sshKeyNew(
                    username,
                    helper.sshPubKey,
                    helper.sshKey,
                    helper.sshPassphrase);
                }
              }
            }
          });
      });
    });

    after(() => {
      fs.removeSync("/tmp/remote-repository");
      fs.removeSync("/tmp/my_document");
    });

    context("with valid SSH key", () => {
      it("resolves", () => {
        let git = new GitRepository("/tmp/my_document");
        return git.setCredFromSSHKey(helper.sshPubKey,
                                     helper.sshKey,
                                     helper.sshPassphrase);
      });
    });

    context("with invalid SSH key", () => {
      it("rejects", () => {
        let git = new GitRepository("/tmp/my_document");
        let promise = git.setCredFromSSHKey(helper.sshPubKey,
                                            helper.sshKey,
                                            "Missing passphrase");
        assert.isRejected(promise);
      });
    });
  });

  describe("#hasValidCred", () => {
    beforeEach(() => {
      fs.mkdirSync("/tmp/remote-repository");
      return NodeGit.Repository.init("/tmp/remote-repository", 1)
      .then(() => {
        return NodeGit.Clone(
          `ssh://${process.env.USER}@localhost/tmp/remote-repository`,
          "/tmp/my_document", {
            fetchOpts: {
              callbacks: {
                credentials: (url: string, username: string): any => {
                  return NodeGit.Cred.sshKeyNew(
                    username,
                    helper.sshPubKey,
                    helper.sshKey,
                    helper.sshPassphrase);
                }
              }
            }
          });
      });
    });

    afterEach(() => {
      fs.removeSync("/tmp/remote-repository");
      fs.removeSync("/tmp/my_document");
    });

    context("with valid SSH key", () => {
      it("returns true", () => {
        let git = new GitRepository("/tmp/my_document");
        return git.setCredFromSSHKey(helper.sshPubKey,
                                     helper.sshKey,
                                     helper.sshPassphrase)
        .finally(() => {
          assert.ok(git.hasValidCred());
        });
      });
    });

    context("with invalid SSH key", () => {
      it("returns false", () => {
        let git = new GitRepository("/tmp/my_document");
        return git.setCredFromSSHKey(helper.sshPubKey,
                                     helper.sshKey,
                                     "Missing passphrase")
        .catch(() => {})
        .finally(() => {
          assert.notOk(git.hasValidCred());
        });
      });
    });
  });
});
