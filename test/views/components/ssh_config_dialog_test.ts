describe('ssh-config-dialog', () => {
  var link = null;
  var doc = null;
  var dialog = null;

  before((done) => {
    link = document.createElement('link');
    link.rel = 'import';
    link.href = '../../build/views/components/ssh-config-dialog/ssh-config-dialog.html';
    link.onload = () => { done() }
    document.head.appendChild(link);
  });

  after(() => {
    link.remove();
  });

  beforeEach(() => {
    doc = (<any>document).implementation.createHTMLDocument();
    dialog = doc.createElement('dialog', 'adv-ssh-config-dialog');
    doc.body.appendChild(dialog);
  });

  afterEach(() => {
    doc.documentElement.remove()
  });

  describe('publicKey property', () => {
    it('visible public key', () => {
      dialog.publicKey = 'my_key.pub'
      assert.equal(dialog.querySelector('#public_key').value,
                   'my_key.pub');
    });

    it('returns public key', () => {
      dialog.querySelector('#public_key').value = 'my_key.pub'
      assert.equal(dialog.publicKey, 'my_key.pub');
    });
  });

  describe('privateKey property', () => {
    it('visible private key', () => {
      dialog.privateKey = 'my_key.pub'
      assert.equal(dialog.querySelector('#private_key').value,
                   'my_key.pub');
    });

    it('returns private key', () => {
      dialog.querySelector('#private_key').value = 'my_key.pub'
      assert.equal(dialog.privateKey, 'my_key.pub');
    });
  });

  describe('passphrase property', () => {
    it('visible passphrase', () => {
      dialog.passphrase = 'password'
      assert.equal(dialog.querySelector('#passphrase').value,
                   'password');
    });

    it('returns passphrase', () => {
      dialog.querySelector('#passphrase').value = 'password'
      assert.equal(dialog.passphrase, 'password');
    });
  });

  describe('authFromKey property', () => {
    it('returns true', () => {
      dialog.querySelector('#auth_from_key').click();
      assert.ok(dialog.authFromKey);
    });
  });

  describe('authFromAgent property', () => {
    it('returns true', () => {
      dialog.querySelector('#auth_from_agent').click();
      assert.ok(dialog.authFromAgent);
    });
  });
})
