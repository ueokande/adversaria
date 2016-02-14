interface NoteListElement extends HTMLUListElement{
  addItem(filename: string, filetype: string): void;
  clearItems(): void;
  onFileClick(callback: Function): void;
}

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(HTMLUListElement.prototype);
prot.addItem = function(filename: string, filetype: string) {
  var textnode = document.createTextNode(filename);
  var li = document.createElement('li');
  li.appendChild(textnode);
  li.addEventListener('click', () => {
    var e = new CustomEvent('item_click', {
      detail: { filename: filename }
    });
    this.dispatchEvent(e);
  });
  this.appendChild(li);
}

prot.clearItems = function() {
  while(this.firstChild) {
    this.removeChild(this.firstChild);
  }
}

var _ = (<any>document).registerElement('adv-note-list', {
  prototype: prot,
  extends: 'ul'
})

})();
