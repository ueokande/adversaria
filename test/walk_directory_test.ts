import walkDirectory from '../build/walk_directory';

describe('walkDirectories helper', () => {
  context('when absolute path', () => {
    it('contains each directories', (done) => {
      var dir = __dirname + '/testdata/';
      walkDirectory(__dirname + '/testdata')
      .then((tree) => {
        assert.deepEqual(tree['my_document']['api'], {});
        assert.deepEqual(tree['my_document']['install'], {});
      }).then(done, done);
    });
  });

  context('when relative path', () => {
    it('contains each directories', (done) => {
      walkDirectory('test/testdata')
      .then((tree) => {
        assert.deepEqual(tree['my_document']['api'], {});
        assert.deepEqual(tree['my_document']['install'], {});
      }).then(done, done);
    });
  });
});
