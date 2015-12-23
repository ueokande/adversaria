var Note = require('../../build/renderer/note')
var assert = require('chai').assert;

describe('Note class', () => {
  var test_note = null;
  before(function(done) {
    test_note = new Note(__dirname + '/../testdata/note.md')
    done();
  });

  it('File name of the note', () => {
    assert.include(test_note.fileName, 'note.md');
  })

  it('Content of the note', () => {
    assert.include(test_note.content, 'Hello');
  })
})
