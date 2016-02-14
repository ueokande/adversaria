interface NavigatorElement extends HTMLUListElement{
  addItem(filename: string, filetype: string): void;
  clearItems(): void;
  setParentButton(on: boolean): void;
}

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(HTMLUListElement.prototype);
prot.addItem = function(filename: string, filetype: string) {
  var template;
  var textnode = document.createTextNode(filename);
  var clone;
  if (filetype == 'directory') {
    template = currentDocument.getElementById('navigator-directory-item-template');
    clone = <HTMLElement>document.importNode(template.content, true);
    var li = clone.querySelector('li')
    li.appendChild(textnode);
    li.addEventListener('click', () => {
      var event = new CustomEvent('directory_click', {
        detail: { directory: filename }
      });
      this.dispatchEvent(event);
    });
  } else if (filetype == 'file') {
    template = currentDocument.getElementById('navigator-file-item-template');
    clone = <HTMLElement>document.importNode(template.content, true);
    var li = clone.querySelector('li')
    li.appendChild(textnode);
    li.addEventListener('click', () => {
      var event = new CustomEvent('file_click', {
        detail: { filename: filename }
      });
      this.dispatchEvent(event);
    });
  }
  this.appendChild(clone);
}

prot.clearItems = function() {
  while(this.firstChild) {
    this.removeChild(this.firstChild);
  }
  this.setParentButton(this.parentButton);
}

prot.setParentButton = function(on: boolean) {
  if (on) {
    if (document.querySelector('li.parent')) {
      return;
    }
    var li = document.createElement('li');
    li.className = 'file_item parent';
    li.addEventListener('click', () => {
      var event = new CustomEvent('directory_click', {
        detail: { directory: '..' }
      });
      this.dispatchEvent(event);
    });
    this.appendChild(li);
  } else {
    var li = <HTMLLIElement>document.querySelector('li.parent');
    if (li) { li.remove(); }
  }
  this.parentButton = on;
}

var _ = (<any>document).registerElement('adv-navigator', {
  prototype: prot,
  extends: 'ul'
})

})();
