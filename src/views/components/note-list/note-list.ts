interface NoteListElement extends HTMLUListElement {
  addItem(filename: string, title: string, body: string): void;
  clearItems(): void;
  onFileClick(callback: Function): void;
}

(function(): void {

let currentDocument = document.currentScript.ownerDocument;

let prot = Object.create(HTMLUListElement.prototype);
prot.addItem = function(filename: string, title: string, body: string): void {
  let template = <HTMLTemplateElement>currentDocument.getElementById("note-list-item-template");
  let clone = <HTMLElement>document.importNode(template.content, true);
  clone.querySelector(".title").appendChild(document.createTextNode(title));
  clone.querySelector(".body").appendChild(document.createTextNode(body));
  let input = clone.querySelector("input");
  let label = <HTMLLabelElement>clone.querySelector("label");
  input.id = label.htmlFor = filename;
  clone.querySelector("li").addEventListener("click", () => {
    let event = new CustomEvent("item_click", {
      detail: { filename: filename }
    });
    this.dispatchEvent(event);
  });
  this.appendChild(clone);
};


prot.clearItems = function(): void {
  while (this.firstChild) {
    this.removeChild(this.firstChild);
  }
};

document.registerElement("adv-note-list", {
  prototype: prot,
  extends: "ul"
});

})();
