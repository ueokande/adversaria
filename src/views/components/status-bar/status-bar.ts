interface StatusBarElement extends HTMLParagraphElement {
  text: string;
}

(function(): any {

let prot = Object.create(HTMLParagraphElement.prototype);

Object.defineProperty(prot, "text", {
  set: function(value: string): string {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(document.createTextNode(value));
    return value;
  }
});

(<any>document).registerElement("adv-status-bar", {
  prototype: prot,
  extends: "p"
});

})();
