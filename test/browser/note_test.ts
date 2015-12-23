var Note = require('../../build/browser/note')
var assert = require('chai').assert;

describe('Note class', () => {
  var note = null;
  before(function(done) {
    Note.load(__dirname + '/../testdata/note.md', (err, loaded) => {
      note = loaded;
      done();
    });
  });

  it('File name of the note', () => {
    assert.include(note.fileName(), 'note.md');
  })

  it('contains the contents', () => {
    assert.include(note.markdownAsHtml(), 'Hello adversaria');
  })

  it('contains markdown as html', () => {
    assert.include(note.markdownAsHtml(), '<h1>');
  })
})
