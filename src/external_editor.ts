import * as child_process from 'child_process';
const which = require('which');

const cli_editors = ['vi', 'vim', 'emacs', 'nano', 'pico'];
const gui_editors = ['gvim', 'mate', 'subl'];

function searchGuiEditor(): string {
  for (var editor of gui_editors) {
    try { return which.sync(editor); }
    catch (e) {}
  }
  return null;
}

function searchCliEditor(): string {
  for (var editor of cli_editors) {
    try { return which.sync(editor); }
    catch (e) {}
  }
  return null;
}

export function open(path): boolean {
  var editor = null;
  if ((editor = searchGuiEditor()) != null) {
    child_process.spawn(editor, [path]);
  } else if ((editor = searchCliEditor()) != null) {
    child_process.spawn('xterm', ['-e', editor + " " + path]);
  } else {
    return false;
  }
  return true;
}
