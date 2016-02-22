///<reference path='../typings/user_defined/html_dialog_element.d.ts'/>

const remote = require('remote')
const dialog = remote.require('dialog');
const settings = require('./user_settings');

export default class UserSettingsController {
  private element: HTMLDialogElement;

  constructor() {
    this.element = <HTMLDialogElement>document.getElementById('user_settings_dialog');

    var close_button = this.element.querySelector('.close-button');
    close_button.addEventListener('click', () => {
      this.dialogClose();
    });
    var showDirectoryDialog = document.querySelector('.show-directory-dialog');
    showDirectoryDialog.addEventListener('click', () => {
      this.showDirectoryDialog();
    });
  }

  dialogClose(): void {
    this.element.close();
  }

  dialogShow(): void {
    this.element.showModal();
  }

  private showDirectoryDialog() {
    var options = {
      title: 'Choose directory of documents',
      properties: ['openDirectory']
    };
    dialog.showOpenDialog(options, (filenames) => {
      var input = <HTMLInputElement>this.element.querySelector('.current-directory');
      input.value = filenames[0];
      settings.saveDocumentPath(filenames[0]);
    });
  }
}
