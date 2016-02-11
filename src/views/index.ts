///<reference path='user_settings_dialog.ts'/>
///<reference path='components/navigator/navigator.ts'/>
///<reference path='components/status-bar/status-bar.ts'/>

import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import * as settings from '../user_settings';
import GitRepository from '../git_repository';
import * as externalEditor from './../external_editor';
import NoteController from '../note_controller';
import NavigatorController from '../navigator_controller';

var noteController;
var watcher;
var git;

window.onload = () => {
  var statusBar = <StatusBarElement>document.getElementById('status-bar');

  var document_path = settings.loadDocumentPath();
  if (!document_path) {
    UserSettingsDialog.show();
  }

  git = new GitRepository(document_path);

  noteController = new NoteController;

  var navigatorController = new NavigatorController;
  navigatorController.setDocumentPath(document_path);
  navigatorController.onFileSelect(function(filename, fullpath) {
    if (watcher) { this.watcher.close(); }
    watcher = chokidar.watch(fullpath, { persistent: true });
    watcher.on('change', () => {
      noteController.open(fullpath)

      statusBar.text = 'Commiting files...'
      git.commit_all_changes().then((oid) => {
        statusBar.text = 'Committed to ' + oid.tostrS().slice(0,7);
      });
    });
    noteController.open(fullpath);
  });
}

window.onkeypress = (e) => {
  if (e.keyCode == 101) { // e
    var path = noteController.currentFile();
    if (path && path.length == 0) {
      return true;
    }
    externalEditor.open(path)
  }
}
