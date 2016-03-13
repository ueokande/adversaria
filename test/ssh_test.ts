///<reference path="../typings/user_defined/nodegit.d.ts"/>

import * as fs from "fs-extra";
import * as NodeGit from "nodegit";
import * as helper from "./test_helper";

describe("SSH authentication", () => {
  before(() => {
    fs.mkdirSync("/tmp/test-remote");
    return NodeGit.Repository.init("/tmp/test-remote", 1);
  });

  after(() => {
    fs.removeSync("/tmp/test-remote");
  });

  describe("Clone repository via SSH ", () => {
    let repository;
    before(() => {
      let cloneOptions = {
        fetchOpts: {
          callbacks: {
            certificateCheck: (): number => { return 1; },
            credentials: (url: string, username: string): any => {
              return NodeGit.Cred.sshKeyNew(
                username,
                helper.sshPubKey,
                helper.sshKey,
                helper.sshPassphrase);
            }
          }
        }
      };
      return NodeGit.Clone(
        `ssh://${process.env.USER}@localhost/tmp/test-remote`,
        "/tmp/test-local",
        cloneOptions)
      .then((_) => { repository = _; });
    });

    after(() => {
      fs.removeSync("/tmp/test-local");
    });

    it("has remote reposi", () => {
      assert.equal("/tmp/test-local/.git/", repository.path());
    });
  });
});
