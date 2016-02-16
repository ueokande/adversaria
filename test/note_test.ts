import Note from '../build/note'

describe('Note class', () => {
  var note = null;
  before(function(done) {
    Note.load(__dirname + '/testdata/my_first_note.md', (err, loaded) => {
      note = loaded;
      done();
    });
  });

  describe('#title property', () => {
    context('when the title is empty', () => {
      it('returns from file name', (done) => {
        Note.load(__dirname + '/testdata/my_first_note.md', (err, loaded) => {
          assert.equal(loaded.title, 'my first note');
          done();
        });
      });
    });

    context('when the title is given', () => {
      it('returns from title attribute', (done) => {
        Note.load(__dirname + '/testdata/my_second_note.md', (err, loaded) => {
          assert.equal(loaded.title, 'Adversaria in the future');
          done();
        });
      });
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
