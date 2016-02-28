///<reference path="../../../../typings/user_defined/html_dialog_element.d.ts"/>
///<reference path="../dialog-base/dialog-base.ts"/>

interface UserSettingsDialogElement extends DialogBaseElement {
  projectPath: string;
}

(function(): void {

let currentDocument = (<any>document).currentScript.ownerDocument;

let prot = Object.create(DialogBaseElement.prototype);

prot.createdCallback = function (): void {
  DialogBaseElement.prototype.createdCallback.call(this);
  let template = currentDocument.getElementById("user-settings-dialog-contents-template");
  let clone = <HTMLElement>document.importNode(template.content, true);
  this.content.appendChild(clone);

  this.querySelector(".show-directory-dialog").addEventListener("click", () => {
    let event = new CustomEvent("select_directory");
    this.dispatchEvent(event);
  });
};

Object.defineProperty(prot, "projectPath", {
  set: function(value: string): string {
    return this.querySelector(".current-directory").value = value;
  },

  get: function(): string {
    return this.querySelector(".current-directory").value;
  }
});

(<any>document).registerElement("adv-user-settings-dialog", {
  prototype: prot,
  extends: "dialog"
});

})();
