interface NoteListElement extends HTMLUListElement{
  addItem(filename: string, title: string, body: string): void;
  clearItems(): void;
  onFileClick(callback: Function): void;
}

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(HTMLUListElement.prototype);
prot.addItem = function(filename: string, title: string, body: string) {
  var template = currentDocument.getElementById('note-list-item-template');
  var clone = <HTMLElement>document.importNode(template.content, true);
  clone.querySelector('.title').appendChild(document.createTextNode(title));
  clone.querySelector('.body').appendChild(document.createTextNode(body));
  var that = this;
  clone.querySelector('li').addEventListener('click', function() {
    if (that.active_item_) { that.active_item_.className = '' }
    that.active_item_ = this;
    this.className = 'active'
    var new_event = new CustomEvent('item_click', {
      detail: { filename: filename }
    });
    that.dispatchEvent(new_event);
  });
  this.appendChild(clone);
  this.active_item_ = null;
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
