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
  li.addEventListener('click', (e) => {
    if (this.active_item_) { this.active_item_.className = '' }
    this.active_item_ = e.target;
    this.active_item_.className = 'active'
    var new_event = new CustomEvent('item_click', {
      detail: { filename: filename }
    });
    this.dispatchEvent(new_event);
  });
  this.appendChild(li);

  this.active_item_ = null;
}

prot.clearItems = function() {
  while(this.firstChild) {
    this.removeChild(this.firstChild);
  }
}

Object.defineProperty(prot, 'activeItem', {
  get: function() {
    return this.active_item_;
  }
});

var _ = (<any>document).registerElement('adv-note-list', {
  prototype: prot,
  extends: 'ul'
})

})();
