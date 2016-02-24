///<reference path='../../../../typings/user_defined/html_dialog_element.d.ts'/>

interface DialogBaseElement extends HTMLDialogElement {
  cancelable: boolean;
  title: string;
}

var DialogBaseElement;

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(HTMLDialogElement.prototype);

prot.createdCallback = function () {
  var template = currentDocument.getElementById('dialog-base-template');
  var clone = <HTMLElement>document.importNode(template.content, true);
  this.classList.add('dialog');
  this.appendChild(clone);
  this.attributeChangedCallback();

  this.querySelector('.ok-button').addEventListener('click', () => {
    var event = new CustomEvent('ok');
    this.dispatchEvent(event);
  });
  var listener = () => {
    var event = new CustomEvent('cancel');
    this.dispatchEvent(event);
  }
  this.querySelector('.cancel-button').addEventListener('click', listener);
  this.querySelector('.close-button').addEventListener('click', listener);
}

prot.attributeChangedCallback = function () {
  if (this.cancelable) {
    var cancelbutton = this.querySelector('.cancel-button')
    cancelbutton.classList.remove('invisible');
    var closebutton = this.querySelector('.close-button')
    closebutton.classList.remove('invisible');
  } else {
    var cancelbutton = this.querySelector('.cancel-button')
    cancelbutton.classList.add('invisible');
    var closebutton = this.querySelector('.close-button')
    closebutton.classList.add('invisible');
  }
}

Object.defineProperty(prot, 'content', {
  get: function() {
    return this.querySelector('.content');
  }
});

Object.defineProperty(prot, 'title', {
  set: function(value) {
    var elem = this.querySelector('.title');
    elem.textContent = value;
  }
});

Object.defineProperty(prot, 'cancelable', {
  set: function(value) {
    if (value) {
      this.setAttribute('cancelable', '');
    } else {
      this.removeAttribute('cancelable');
    }
  },

  get: function() {
    return this.hasAttribute('cancelable');
  }
});

DialogBaseElement = (<any>document).registerElement('adv-dialog-base', {
  prototype: prot,
  extends: 'dialog'
})

})();
