interface NoteViewElement extends HTMLElement {
  title: string;
  body: string;
  path: string;
}

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(HTMLElement.prototype);

prot.createdCallback = function () {
  var template = currentDocument.getElementById('note-view-template');
  var clone = <HTMLElement>document.importNode(template.content, true);
  this.appendChild(clone);
}

Object.defineProperty(prot, 'title', {
  set: function(value) {
    var elem = this.querySelector('#note-view-title');
    while(elem.firstChild) { elem.removeChild(elem.firstChild); }
    elem.appendChild(document.createTextNode(value));
  }
});

Object.defineProperty(prot, 'body', {
  set: function(value) {
    var elem = this.querySelector('#note-view-body');
    elem.innerHTML = value;
  }
});

Object.defineProperty(prot, 'path', {
  set: function(value) {
    var elem = this.querySelector('#note-view-path');
    while(elem.firstChild) { elem.removeChild(elem.firstChild); }
    elem.appendChild(document.createTextNode(value));
  }
});

var _ = (<any>document).registerElement('adv-note-view', {
  prototype: prot
});

})();
