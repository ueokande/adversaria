import * as helper from '../../test_helper';

describe('navigator', () => {
  var nav = null;
  helper.useComponent(
    '../../build/views/components/navigator/navigator.html',
    (_) => { nav = _; },
    'ul', 'adv-navigator');

  var tree = {
    usr: {
      bin: {},
      lib: { git: {} },
      share: { git: {} },
    },
    etc: { git: {} }
  }
  beforeEach(() => {
    nav.setDirectoryTree(tree);
  });

  describe('elements', () => {

    it('has collapsible checkbox', () => {
      var doc = nav.ownerDocument;
      var usr_lib_check = doc.getElementById('collapsible-/usr/lib');
      assert.ok(usr_lib_check);
      assert.equal(usr_lib_check.type, 'checkbox');
    });

    it('doee not have collapsible checkbox for leaf directory', () => {
      var doc = nav.ownerDocument;
      var usr_bin_check = doc.getElementById('collapsible-/usr/bin');
      assert.notOk(usr_bin_check);
    });

    it('has selectable radio button', () => {
      var doc = nav.ownerDocument;
      var etc_git_radio = doc.getElementById('/etc/git');
      assert.ok(etc_git_radio);
      assert.equal(etc_git_radio.type, 'radio');
    });
  });

  describe('events', () => {
    it('emits directory_click events', (done) => {
      var doc = nav.ownerDocument;
      var etc_git_radio = doc.getElementById('/etc/git');
      nav.addEventListener('directory_click', (e) => {
        assert.equal(e.detail.directory, '/etc/git');
        done();
      });
      etc_git_radio.click();
    });
  });
})
