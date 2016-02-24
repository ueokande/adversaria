describe('dialog-base', () => {
  var link = null;
  var doc = null;
  var dialog = null;

  before((done) => {
    link = document.createElement('link');
    link.rel = 'import';
    link.href = '../../build/views/components/dialog-base/dialog-base.html';
    link.onload = () => { done() }
    document.head.appendChild(link);
  });

  after(() => {
    link.remove();
  });

  beforeEach(() => {
    doc = (<any>document).implementation.createHTMLDocument();
    dialog = doc.createElement('dialog', 'adv-dialog-base');
    doc.body.appendChild(dialog);
  });

  afterEach(() => {
    doc.documentElement.remove()
  });

  describe('elements', () => {
    it('has each elements', () => {
      assert.ok(dialog.querySelector('.title'));
      assert.ok(dialog.querySelector('.ok-button'));
      assert.ok(dialog.querySelector('.cancel-button'));
      assert.ok(dialog.querySelector('.close-button'));
    });
  });

  describe('title property', () => {
    it('changes the title element', () => {
      dialog.title = 'Hello Dialog';
      assert.equal('Hello Dialog',
                   dialog.querySelector('.title').textContent);
    });
  });

  describe('cancelable property', () => {
    it('hide cancel buttons', () => {
      dialog.cancelable = true;
      assert.notInclude(dialog.querySelector('.cancel-button').className,
                        'invisible');
      assert.notInclude(dialog.querySelector('.close-button').className,
                        'invisible');
    });

    it('show cancel buttons', () => {
      dialog.cancelable = false;
      assert.include(dialog.querySelector('.cancel-button').className,
                     'invisible');
      assert.include(dialog.querySelector('.close-button').className,
                    'invisible');
    });
  });
})
