
import * as fs from "fs";
import * as path from "path";

function readData(key: string): any {
  "use strict";
  try {
    let text = fs.readFileSync(configPath(), "utf-8");
    let data = JSON.parse(text);
    return data[key] || undefined;
  } catch (e) {
    return undefined;
  }
}

function touchConfigFile(): void {
  "use strict";
  if (exist()) {
    return;
  }
  let dir = configDirectory();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(configPath(), "{}");
}

function writeData(key: string, value: any): void {
  "use strict";
  touchConfigFile();
  let text = fs.readFileSync(configPath(), "utf-8");
  let obj = JSON.parse(text);
  obj[key] = value;
  text = JSON.stringify(obj);
  fs.writeFileSync(configPath(), text);
}

export function exist(): boolean {
  "use strict";
  try {
    fs.accessSync(configPath(), fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

export function configDirectory(): string {
  "use strict";
  let homeDir = process.env.HOME || process.env.USERPROFILE;
  return path.join(homeDir, ".adversaria");
}

export function configPath(): string {
  "use strict";
  return path.join(configDirectory(), "config.json");
}

export function loadDocumentPath(): string {
  "use strict";
  return readData("document_path");
}

export function saveDocumentPath(path: string): void {
  "use strict";
  writeData("document_path", path);
}
