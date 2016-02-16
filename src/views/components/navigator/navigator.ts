interface NavigatorElement extends HTMLUListElement{
  setDirectoryTree(tree: any): void;
  clearItems(): void;
}

(function() {

var currentDocument = (<any>document).currentScript.ownerDocument;

var prot = Object.create(HTMLUListElement.prototype);
prot.clearItems = function() {
  while(this.firstChild) {
    this.removeChild(this.firstChild);
  }
}

prot.setDirectoryTree = function(tree) {
  var element = this;
  var setTree = function(parent: HTMLElement, nodes: any, base: string) {
    for (var key in nodes) {
      var fullpath = base + '/' + key;

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'directory';
      radio.id = fullpath;
      radio.addEventListener('click', function() {
        var event = new CustomEvent('directory_click', {
          detail: { directory: this.id }
        });
        element.dispatchEvent(event);
      });

      var directoryLabel = document.createElement('label');
      directoryLabel.className = 'directory';
      directoryLabel.htmlFor = radio.id;
      directoryLabel.appendChild(document.createTextNode(key));

      var li = document.createElement('li');
      li.appendChild(radio);
      li.appendChild(directoryLabel);

      if (Object.keys(nodes[key]).length != 0) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'collapsible-' + fullpath;

        var collapsibleLabel = document.createElement('label');
        collapsibleLabel.className = 'collapsible'
        collapsibleLabel.htmlFor = checkbox.id;

        var ul = document.createElement('ul');
        setTree(ul, nodes[key], fullpath);

        li.appendChild(checkbox);
        li.appendChild(collapsibleLabel);
        li.appendChild(ul);
      }
      parent.appendChild(li);
    }
  };

  setTree(this, tree, '');
}

var _ = (<any>document).registerElement('adv-navigator', {
  prototype: prot,
  extends: 'ul'
})

})();
