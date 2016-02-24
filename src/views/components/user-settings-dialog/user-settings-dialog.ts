///<reference path='../../../../typings/user_defined/html_dialog_element.d.ts'/>
///<reference path='../dialog-base/dialog-base.ts'/>

interface UserSettingsDialogElement extends DialogBaseElement {
}

var DialogBaseElement;

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(DialogBaseElement.prototype);

prot.createdCallback = function () {
  DialogBaseElement.prototype.createdCallback.call(this);
  var template = currentDocument.getElementById('user-settings-dialog-contents-template');
  var clone = <HTMLElement>document.importNode(template.content, true);
  this.content.appendChild(clone);

  this.querySelector('.show-directory-dialog').addEventListener('click', () => {
    var event = new CustomEvent('select_directory');
    this.dispatchEvent(event);
  });
}

Object.defineProperty(prot, 'projectPath', {
  set: function(value) {
    this.querySelector('.current-directory').value = value;
  },

  get: function() {
    return this.querySelector('.current-directory').value;
  }
});

(<any>document).registerElement('adv-user-settings-dialog', {
  prototype: prot,
  extends: 'dialog'
})

})();
