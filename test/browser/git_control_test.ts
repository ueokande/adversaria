var GitControl = require('../../build/browser/git_control');
var assert = require('chai').assert;

describe('GitControl class', () => {
  var git = new GitControl('/tmp')

  describe('#path', () => {
    it('returns repository path', () => {
      assert.equal('/tmp', git.path());
    });
  });
});
