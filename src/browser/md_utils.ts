var md = require('markdown-it')();
var emoji = require('markdown-it-emoji');
var fs = require('fs');

md.use(emoji);

export function readAsHtml(path): string {
  var text = fs.readFileSync(path, 'utf-8');
  return md.render(text);
}
