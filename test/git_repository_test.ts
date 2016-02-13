import GitRepository from '../build/git_repository';
import * as fs from 'fs-extra';
const NodeGit = require('nodegit');

describe('GitRepository class', () => {
  var git = new GitRepository('/tmp/my_document')

  describe('#path', () => {
    it('returns repository path', () => {
      assert.equal('/tmp/my_document', git.path());
    });
  });

  describe('#commit_all_changes', () => {
    var oid;

    before(function () {
      this.timeout(5000);
      fs.removeSync('/tmp/my_document/');
      fs.copySync(__dirname + '/../test/testdata/my_document',
                  '/tmp/my_document');
      return NodeGit.Repository.init('/tmp/my_document', 0)
        .then(() => { return git.commit_all_changes(); })
        .then((_) => { oid = _; });
    });

    after(() => {
      fs.removeSync('/tmp/my_document/');
    });

    it('returns oid', () => {
      assert.equal(oid.tostrS().length, 40);
    });

    it('commits all changes', () => {
      return NodeGit.Repository.open('/tmp/my_document')
        .then((repo) => { return repo.getStatus(); })
        .then((statuses) => {
          assert.equal(statuses.length, 0);
        });
    });

    it('contains file changes', () => {
      return NodeGit.Repository.open('/tmp/my_document')
        .then((repo) => { return repo.getHeadCommit(); })
        .then((commit) => { return commit.getEntry('api/users.md') })
        .then((entry) => { assert.equal(entry.path(), 'api/users.md') })
    });
  });
});
