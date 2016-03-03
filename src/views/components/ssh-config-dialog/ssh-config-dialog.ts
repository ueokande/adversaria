///<reference path="../dialog-base/dialog-base.ts"/>

interface SSHConfigDialogElement extends DialogBaseElement {
  publicKey: string;
  privateKey: string;
  passphrase: string;
  authFromKey: boolean;
  authFromAgent: boolean;
}

(function(): any {

let currentDocument = document.currentScript.ownerDocument;

let prot = Object.create(DialogBaseElement.prototype);

prot.createdCallback = function (): void {
  DialogBaseElement.prototype.createdCallback.call(this);
  let template = <HTMLTemplateElement>currentDocument.getElementById("ssh-config-dialog-contents-template");
  let clone = <HTMLElement>document.importNode(template.content, true);
  this.content.appendChild(clone);
};

Object.defineProperty(prot, "publicKey", {
  set: function(value: string): string {
    return this.querySelector("#public_key").value = value;
  },

  get: function(): string {
    return this.querySelector("#public_key").value;
  }
});

Object.defineProperty(prot, "privateKey", {
  set: function(value: string): string {
    return this.querySelector("#private_key").value = value;
  },

  get: function(): string {
    return this.querySelector("#private_key").value;
  }
});

Object.defineProperty(prot, "passphrase", {
  set: function(value: string): string {
    return this.querySelector("#passphrase").value = value;
  },

  get: function(): string {
    return this.querySelector("#passphrase").value;
  }
});

Object.defineProperty(prot, "authFromKey", {
  get: function(): string {
    return this.querySelector("#auth_from_key").checked;
  }
});

Object.defineProperty(prot, "authFromAgent", {
  get: function(): string {
    return this.querySelector("#auth_from_agent").checked;
  }
});

(<any>document).registerElement("adv-ssh-config-dialog", {
  prototype: prot,
  extends: "dialog"
});

})();
