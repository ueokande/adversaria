interface StatusBarElement extends HTMLParagraphElement {
  text: string;
}

(function() {

var prot = Object.create(HTMLParagraphElement.prototype);

Object.defineProperty(prot, 'text', {
  set: function(value) {
    while(this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(document.createTextNode(value));
  }
});

var _ = (<any>document).registerElement('adv-status-bar', {
  prototype: prot,
  extends: 'p'
})

})();
