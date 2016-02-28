///<reference path="views/components/ssh-config-dialog/ssh-config-dialog.ts"/>

import Application from "./application";

export default class SSHConfigController {
  private dialog: SSHConfigDialogElement;

  constructor() {
    this.dialog = <SSHConfigDialogElement>document.getElementById("ssh_config_dialog");
    this.dialog.addEventListener("ok", this.commitConfigure);
    this.dialog.addEventListener("cancel", this.dialogClose);
  }

  public dialogShow(): void {
    this.dialog.showModal();
  }

  public dialogClose(): void {
    this.dialog.close();
  }

  private commitConfigure: EventListener = (): void => {
    let dialog = this.dialog;
    function whilst(condition: Function, action: any): Promise<Function> {
      function wrap(fn: Function): Promise<any> { return Promise.resolve(fn()); }
      return wrap(function loop(): Promise<Function> {
        if (condition()) {
          return wrap(action).then(loop);
        }
      });
    }

    function setCredPromise(): Promise<any> {
      let repo = Application.project.repository;
      if (dialog.authFromKey) {
        let publicKey = dialog.publicKey;
        let privateKey = dialog.privateKey;
        let passphrase = dialog.passphrase;
        return repo.setCredFromSSHKey(publicKey, privateKey, passphrase);
      } else if (dialog.authFromAgent) {
        return repo.setCredFromSSHAgent();
      }
    }

    let success = false;
    whilst(() => { return success; },
           setCredPromise()
            .then(() => {
              success = true;
              this.dialogClose();
            })
            .catch((err) => {
              alert(err);
            })
    );
  };
}
