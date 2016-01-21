var assert = require('chai').assert;
var dc = require('../../build/renderer/document_tree')
var DocumentTree = dc.DocumentTree;
DocumentTree.FileType = dc.FileType;

describe('DocumentTree class', () => {
  var documentTree;
  beforeEach(() => {
    documentTree = new DocumentTree(__dirname + '/../testdata/my_document');
  });

  describe('#list', () => {
    it ('lists files', (done) => {
      var count = 0;
      documentTree.list((fullpath, filetype) => {
        assert.match(fullpath, /api|install/);
        assert.equal(filetype, DocumentTree.FileType.Directory);
        count++;
        if (count == 2) { done(); }
      });
    });
  });

  describe('#enter and #current_dir', () => {
    it ('enters and returns current dir', () => {
      documentTree.enter('install');
      assert.include(documentTree.currentDir(), 'my_document/install');
    });
  });

  describe('#isRootDirectory', () => {
    context('when in root directory', () => {
      it ('returns true', () => {
        // assert.equal('debug', documentTree.root_dir);
        // assert.equal('debug', documentTree.current_dir);
        assert.isTrue(documentTree.isRootDirectory());
      });
    });

    context('when not in root directory', () => {
      it ('returns false', () => {
        documentTree.enter('install');
        assert.isFalse(documentTree.isRootDirectory());
      });
    });
  });

  describe('#fullPathOf', () => {
    it ('returns full path of document', () => {
      var fullpath = documentTree.fullPathOf('hoge.md');
      assert.equal(fullpath, documentTree.current_dir + '/' + 'hoge.md');
    });
  });
});
