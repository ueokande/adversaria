interface PathViewElement extends HTMLElement {
  path: string;
}

declare var PathViewElement: {
  prototype: PathViewElement;
  new(): PathViewElement;
}

(function() {

var prot = Object.create(HTMLElement.prototype);

Object.defineProperty(prot, 'path', {
  set: function(value) {
    while(this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(document.createTextNode(value));
  }
});

var _ = (<any>document).registerElement('adv-path-view', {
  prototype: prot
})

})();
