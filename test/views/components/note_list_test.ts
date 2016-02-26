import * as helper from '../../test_helper';
var remoteConsole = require('remote').require('console')

describe('note-list', () => {
  var noteList = null;
  helper.useComponent(
    '../../build/views/components/note-list/note-list.html',
    (_) => { noteList = _ },
    'ul', 'adv-note-list');

  describe('#addItem', () => {
    beforeEach(() => {
      noteList.addItem('my_note.md', 'my_title', 'my_content');
    });
    it('adds an note with title and content', () => {
      var innterHTML = noteList.innerHTML;
      assert.include(innterHTML, 'my_title');
      assert.include(innterHTML, 'my_content');
    });
  });

  describe('#clearItems', () => {
    beforeEach(() => {
      noteList.addItem('my_note.md', 'my_title', 'my_content');
      noteList.clearItems();
    });
    it('remote items from list', () => {
      var innterHTML = noteList.innerHTML;
      assert.notInclude(innterHTML, 'my_title');
      assert.notInclude(innterHTML, 'my_content');
    });
  });

  describe('events', () => {
    beforeEach(() => {
      noteList.addItem('my_note.md', 'my_title', 'my_content');
    });
    it('emits item_click event', (done) => {
      noteList.addEventListener('item_click', (e) => {
        assert.equal(e.detail.filename, 'my_note.md');
        done();
      });
      noteList.querySelector('li').click();
    });
  });
});
