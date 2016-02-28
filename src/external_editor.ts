import * as child_process from "child_process";
const which = require("which");

const CLI_EDITORS = ["vi", "vim", "emacs", "nano", "pico"];
const GUI_EDITORS = ["gvim", "mate", "subl"];

function searchGuiEditor(): string {
  "use strict";
  for (let editor of GUI_EDITORS) {
    try {
      return which.sync(editor);
    } finally {
    }
  }
  return undefined;
}

function searchCliEditor(): string {
  "use strict";
  for (let editor of CLI_EDITORS) {
    try {
      return which.sync(editor);
    } finally {
    }
  }
  return undefined;
}

export function open(path: string): boolean {
  "use strict";
  let editor = undefined;
  if (!(editor = searchGuiEditor())) {
    child_process.spawn(editor, [path]);
  } else if (!(editor = searchCliEditor())) {
    child_process.spawn("xterm", ["-e", editor + " " + path]);
  } else {
    return false;
  }
  return true;
}
