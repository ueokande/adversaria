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
      var textnode = document.createTextNode(key);
      var li = document.createElement('li');
      var label = document.createElement('label');
      label.htmlFor = fullpath;
      label.appendChild(textnode);
      label.addEventListener('click', function() {
        var event = new CustomEvent('directory_click', {
          detail: { directory: this.htmlFor }
        });
        element.dispatchEvent(event);
      });
      if (Object.keys(nodes[key]).length != 0) {
        label.className = 'collapsible';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.id = fullpath;
        var ul = document.createElement('ul');
        setTree(ul, nodes[key], fullpath);

        li.appendChild(input);
        li.appendChild(label);
        li.appendChild(ul);
      } else {
        li.appendChild(label);
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
