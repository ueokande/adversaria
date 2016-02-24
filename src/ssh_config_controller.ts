///<reference path='views/components/ssh-config-dialog/ssh-config-dialog.ts'/>

import Application from './application';

export default class SSHConfigController {
  private dialog: SSHConfigDialogElement;

  constructor() {
    this.dialog = <SSHConfigDialogElement>document.getElementById('ssh_config_dialog');
    this.dialog.addEventListener('ok', this.commitConfigure);
    this.dialog.addEventListener('cancel', this.dialogClose);
  }

  dialogShow() {
    this.dialog.showModal();
  }

  dialogClose() {
    this.dialog.close();
  }

  commitConfigure = () => {
    var dialog = this.dialog;
    function whilst(condition, action) {
      function wrap(fn) { return Promise.resolve(fn()); }
      return wrap(function loop() {
	if (condition()) {
	  return wrap(action).then(loop);
	}
      });
    };

    function setCredPromise() {
      var repo = Application.project.repository;
      if (dialog.authFromKey) {
        var public_key = dialog.publicKey;
        var private_key = dialog.privateKey;
        var passphrase = dialog.passphrase;
        return repo.setCredFromSSHKey(public_key, private_key, passphrase);
      } else if (dialog.authFromAgent) {
        return repo.setCredFromSSHAgent();
      }
    }

    var success = false;
    whilst(() => { return success },
           setCredPromise()
            .then(() => {
              success = true;
              this.dialogClose();
            })
            .catch((err) => {
              alert(err);
            })
    )
  }
}
