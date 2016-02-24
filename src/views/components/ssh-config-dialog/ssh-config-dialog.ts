///<reference path='../../../../typings/user_defined/html_dialog_element.d.ts'/>
///<reference path='../dialog-base/dialog-base.ts'/>

interface SSHConfigDialogElement extends DialogBaseElement {
  publicKey: string;
  privateKey: string;
  passphrase: string;
  authFromKey: boolean;
  authFromAgent: boolean;
}

var DialogBaseElement;

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(DialogBaseElement.prototype);

prot.createdCallback = function () {
  DialogBaseElement.prototype.createdCallback.call(this);
  var template = currentDocument.getElementById('ssh-config-dialog-contents-template');
  var clone = <HTMLElement>document.importNode(template.content, true);
  this.content.appendChild(clone);
}

Object.defineProperty(prot, 'publicKey', {
  set: function(value) {
    this.querySelector('#public_key').value = value;
  },

  get: function() {
    return this.querySelector('#public_key').value;
  }
});

Object.defineProperty(prot, 'privateKey', {
  set: function(value) {
    this.querySelector('#private_key').value = value;
  },

  get: function() {
    return this.querySelector('#private_key').value;
  }
});

Object.defineProperty(prot, 'passphrase', {
  set: function(value) {
    this.querySelector('#passphrase').value = value;
  },

  get: function() {
    return this.querySelector('#passphrase').value;
  }
});

Object.defineProperty(prot, 'authFromKey', {
  get: function() {
    return this.querySelector('#auth_from_key').checked;
  }
});

Object.defineProperty(prot, 'authFromAgent', {
  get: function() {
    return this.querySelector('#auth_from_agent').checked;
  }
});

(<any>document).registerElement('adv-ssh-config-dialog', {
  prototype: prot,
  extends: 'dialog'
})

})();
