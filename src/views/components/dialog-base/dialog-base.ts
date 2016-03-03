interface DialogBaseElement extends HTMLDialogElement {
  createdCallback: () => any;
  cancelable: boolean;
  title: string;
}

interface Window {
  DialogBaseElement: DialogBaseElement;
}

declare var DialogBaseElement: {
  prototype: DialogBaseElement;
};

(function(): any {

let currentDocument = document.currentScript.ownerDocument;

let prot = Object.create(HTMLDialogElement.prototype);

prot.createdCallback = function (): any {
  let template = <HTMLTemplateElement>currentDocument.getElementById("dialog-base-template");
  let clone = <HTMLElement>document.importNode(template.content, true);
  this.classList.add("dialog");
  this.appendChild(clone);
  this.attributeChangedCallback();

  this.querySelector(".ok-button").addEventListener("click", () => {
    let event = new CustomEvent("ok");
    this.dispatchEvent(event);
  });
  let listener = () => {
    let event = new CustomEvent("cancel");
    this.dispatchEvent(event);
  };
  this.querySelector(".cancel-button").addEventListener("click", listener);
  this.querySelector(".close-button").addEventListener("click", listener);
};

prot.attributeChangedCallback = function (): any {
  if (this.cancelable) {
    let cancelbutton = this.querySelector(".cancel-button");
    cancelbutton.classList.remove("invisible");
    let closebutton = this.querySelector(".close-button");
    closebutton.classList.remove("invisible");
  } else {
    let cancelbutton = this.querySelector(".cancel-button");
    cancelbutton.classList.add("invisible");
    let closebutton = this.querySelector(".close-button");
    closebutton.classList.add("invisible");
  }
};

Object.defineProperty(prot, "content", {
  get: function(): string {
    return this.querySelector(".content");
  }
});

Object.defineProperty(prot, "title", {
  set: function(value: string): string {
    let elem = this.querySelector(".title");
    return elem.textContent = value;
  }
});

Object.defineProperty(prot, "cancelable", {
  set: function(value: string): string {
    if (value) {
      this.setAttribute("cancelable", "");
    } else {
      this.removeAttribute("cancelable");
    }
    return value;
  },

  get: function(): string {
    return this.hasAttribute("cancelable");
  }
});

window.DialogBaseElement = document.registerElement("adv-dialog-base", {
  prototype: prot,
  extends: "dialog"
});

})();
