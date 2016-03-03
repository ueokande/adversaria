interface NoteViewElement extends HTMLElement {
  title: string;
  body: string;
  path: string;
}

(function(): any {

let currentDocument = document.currentScript.ownerDocument;

let prot = Object.create(HTMLElement.prototype);

prot.createdCallback = function (): void {
  let template = <HTMLTemplateElement>currentDocument.getElementById("note-view-template");
  let clone = <HTMLElement>document.importNode(template.content, true);
  this.appendChild(clone);
};

Object.defineProperty(prot, "title", {
  set: function(value: string): string {
    let elem = this.querySelector("#note-view-title");
    while (elem.firstChild) { elem.removeChild(elem.firstChild); }
    elem.appendChild(document.createTextNode(value));
    return value;
  }
});

Object.defineProperty(prot, "body", {
  set: function(value: string): string {
    let elem = this.querySelector("#note-view-body");
    return elem.innerHTML = value;
  }
});

Object.defineProperty(prot, "path", {
  set: function(value: string): string {
    let elem = this.querySelector("#note-view-path");
    while (elem.firstChild) { elem.removeChild(elem.firstChild); }
    elem.appendChild(document.createTextNode(value));
    return value;
  }
});

document.registerElement("adv-note-view", {
  prototype: prot
});

})();
