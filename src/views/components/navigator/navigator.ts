interface NavigatorElement extends HTMLUListElement{
  addItem(filename: string, filetype: string): void;
  clearItems(): void;
  setParentButton(on: boolean): void;
}

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(HTMLUListElement.prototype);
prot.addItem = function(filename: string, filetype: string) {
  var textnode = document.createTextNode(filename);
  var li = document.createElement('li');
  li.appendChild(textnode);
  li.classList.add('directory');
  li.addEventListener('click', () => {
    var event = new CustomEvent('directory_click', {
      detail: { directory: filename }
    });
    this.dispatchEvent(event);
  });
  this.appendChild(li);
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
