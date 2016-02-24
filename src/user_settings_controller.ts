///<reference path='views/components/user-settings-dialog/user-settings-dialog.ts'/>

const remote = require('remote')
const dialog = remote.require('dialog');
const settings = require('./user_settings');

export default class UserSettingsController {
  private element: UserSettingsDialogElement;

  constructor() {
    this.element = <UserSettingsDialogElement>document.getElementById('user_settings_dialog');
    this.element.addEventListener('select_directory', () => {
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
      this.element.projectPath = filenames[0];
      settings.saveDocumentPath(filenames[0]);
    });
  }
}
