describe('user-settings-dialog', () => {
  var link = null;
  var doc = null;
  var dialog = null;

  before((done) => {
    link = document.createElement('link');
    link.rel = 'import';
    link.href = '../../build/views/components/user-settings-dialog/user-settings-dialog.html';
    link.onload = () => { done() }
    document.head.appendChild(link);
  });

  after(() => {
    link.remove();
  });

  beforeEach(() => {
    doc = (<any>document).implementation.createHTMLDocument();
    dialog = doc.createElement('dialog', 'adv-user-settings-dialog');
    doc.body.appendChild(dialog);
  });

  afterEach(() => {
    doc.documentElement.remove()
  });

  describe('events', () => {
    it('emit select_directory event', (done) => {
      dialog.addEventListener('select_directory', () => { done() });
      dialog.querySelector('.show-directory-dialog').click();
    });
  });

  describe('projectPath property', () => {
    it('visible project path', () => {
      dialog.projectPath = '/hoge/fuga/piyo';
      assert.equal(dialog.querySelector('.current-directory').value,
                   '/hoge/fuga/piyo');
    });

    it('returns project path', () => {
      dialog.querySelector('.current-directory').value = '/hoge/fuga/piyo';
      assert.equal(dialog.projectPath, '/hoge/fuga/piyo');
    });
  });
})
