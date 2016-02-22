///<reference path='views/components/navigator/navigator.ts'/>
///<reference path='views/components/status-bar/status-bar.ts'/>

import * as fs from 'fs';
import * as path from 'path';
import * as settings from './user_settings';
import Project from './project';
import * as externalEditor from './external_editor';
import UserSettingsController from './user_settings_controller';
import NoteController from './note_controller';
import NoteListController from './note_list_controller';
import NavigatorController from './navigator_controller';

export function run() {
  var noteController;
  var noteListController;
  var userSettingsController;
  var project;

  window.onload = () => {
    var userSettingsController = new UserSettingsController();

    var document_path = settings.loadDocumentPath();
    if (!document_path) {
      userSettingsController.dialogShow();
      return;
    }

    project = new Project(document_path);

    noteController = new NoteController;
    noteListController = new NoteListController();

    var navigatorController = new NavigatorController;
    navigatorController.setProjectPath(document_path);
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

  window.addEventListener('adv.project.changed', () => {
    var statusBar = <StatusBarElement>document.getElementById('status-bar');
    statusBar.text = 'Commiting files...';
    project.repository.commit_all_changes().then((oid) => {
      statusBar.text = 'Committed to ' + oid.tostrS().slice(0,7);
    });
  });

  window.addEventListener('adv.file_select', (e: any) => {
    noteController.open(e.detail.fullpath);
  });

  window.addEventListener('adv.directory_select', (e: any) => {
    noteListController.setNoteListDirectory(e.detail.fullpath);
  });
}
