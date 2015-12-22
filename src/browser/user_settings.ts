var path = require('path');
var fs = require('fs');

function readData(key: string): any {
  try {
    var text = fs.readFileSync(configPath(), 'utf-8');
  } catch(e) {
    return null;
  }
  var data = JSON.parse(text);
  return data[key] || null;
}

function touchConfigFile(): void {
  if (exist()) {
    return;
  }
  var dir = configDirectory();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(configPath(), "{}");
}

function writeData(key: string, value: any): void {
  touchConfigFile();
  var text = fs.readFileSync(configPath(), 'utf-8');
  var obj = JSON.parse(text);
  obj[key] = value;
  text = JSON.stringify(obj);
  fs.writeFileSync(configPath(), text);
}

export function exist(): boolean {
  try {
    fs.access(configPath(), fs.F_OK);
  } catch(e) {
    return false
  }
  return true
}

export function configDirectory(): string {
  var home_dir = process.env.HOME || process.env.USERPROFILE;
  return path.join(home_dir, '.adversaria');
}

export function configPath(): string {
  return path.join(configDirectory(), 'config.json');
}

export function loadDocumentPath(): string {
  return readData('document_path');
}

export function saveDocumentPath(path: string): void {
  writeData('document_path', path);
}
