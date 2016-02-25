export function useComponent(import_path: string,
                             callback: Function,
                             tagName: string,
                             is: string) {
  var link = null;
  var doc = null;
  var dialog = null;

  before((done) => {
    link = document.createElement('link');
    link.rel = 'import';
    link.href = import_path;
    link.onload = () => { done() }
    document.head.appendChild(link);
  });

  after(() => {
    link.remove();
  });

  beforeEach(() => {
    doc = (<any>document).implementation.createHTMLDocument();
    dialog = doc.createElement(tagName, is);
    doc.body.appendChild(dialog);
    callback(dialog);
  });

  afterEach(() => {
    doc.documentElement.remove()
  });

  return function() { return dialog };
}
