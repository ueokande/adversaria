import Note from '../build/note'

describe('Note class', () => {
  var note = null;
  before(function(done) {
    Note.load(__dirname + '/testdata/my_first_note.md', (err, loaded) => {
      note = loaded;
      done();
    });
  });

  it('File name of the note', () => {
    assert.include(note.fileName(), 'note.md');
  })

  it('transforms title of the note', () => {
    assert.include(note.title(), 'my first note');
  })

  it('contains the contents', () => {
    assert.include(note.markdownAsHtml(), 'Hello adversaria');
  })

  it('contains markdown as html', () => {
    assert.include(note.markdownAsHtml(), '<h1>');
  })
})
