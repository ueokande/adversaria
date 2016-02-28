interface NavigatorElement extends HTMLUListElement {
  setDirectoryTree(tree: any): void;
  clearItems(): void;
}

(function(): any {

let prot = Object.create(HTMLUListElement.prototype);
prot.clearItems = function(): any {
  while (this.firstChild) {
    this.removeChild(this.firstChild);
  }
};

prot.setDirectoryTree = function(tree: {[key: string]: any}): any {
  let element = this;
  let setTree = function(parent: HTMLElement, nodes: any, base: string): any {
    for (let key in nodes) {
      let fullpath = base + "/" + key;

      let radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "directory";
      radio.id = fullpath;
      radio.addEventListener("click", function(): void {
        let event = new CustomEvent("directory_click", {
          detail: { directory: this.id }
        });
        element.dispatchEvent(event);
      });

      let directoryLabel = document.createElement("label");
      directoryLabel.className = "directory";
      directoryLabel.htmlFor = radio.id;
      directoryLabel.appendChild(document.createTextNode(key));

      let li = document.createElement("li");
      li.appendChild(radio);
      li.appendChild(directoryLabel);

      if (Object.keys(nodes[key]).length !== 0) {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "collapsible-" + fullpath;

        let collapsibleLabel = document.createElement("label");
        collapsibleLabel.className = "collapsible";
        collapsibleLabel.htmlFor = checkbox.id;

        let ul = document.createElement("ul");
        setTree(ul, nodes[key], fullpath);

        li.appendChild(checkbox);
        li.appendChild(collapsibleLabel);
        li.appendChild(ul);
      }
      parent.appendChild(li);
    }
  };

  setTree(this, tree, "");
};

(<any>document).registerElement("adv-navigator", {
  prototype: prot,
  extends: "ul"
});

})();
