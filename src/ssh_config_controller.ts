///<reference path='../typings/user_defined/html_dialog_element.d.ts'/>

import Application from './application';

export default class SSHConfigController {
  private element: HTMLDialogElement;

  constructor() {
    this.element = <HTMLDialogElement>document.getElementById('ssh_config_dialog');
    document.getElementById('ssh_config_dialog_ok_button').addEventListener('click', this.commitConfigure);
  }

  dialogShow() {
    this.element.showModal();
  }

  dialogClose() {
    this.element.close();
  }

  commitConfigure = () => {
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
      if ((<HTMLInputElement>document.getElementById('auth_type_from_key')).checked) {
        var public_key = (<HTMLInputElement>document.getElementById('ssh_public_key')).value;
        var private_key = (<HTMLInputElement>document.getElementById('ssh_private_key')).value;
        var passphrase = (<HTMLInputElement>document.getElementById('ssh_passphrase')).value;
        return repo.setCredFromSSHKey(public_key, private_key, passphrase);
      } else if ((<HTMLInputElement>document.getElementById('auth_type_from_agent')).checked) {
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
