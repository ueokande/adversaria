export function useComponent(importPath: string,
                             callback: Function,
                             tagName: string,
                             is: string): void {
  "use strict";

  let link = undefined;
  let doc = undefined;
  let dialog = undefined;

  before((done) => {
    link = document.createElement("link");
    link.rel = "import";
    link.href = importPath;
    link.onload = () => { done(); };
    document.head.appendChild(link);
  });

  after(() => {
    link.remove();
  });

  beforeEach(() => {
    doc = document.implementation.createHTMLDocument();
    dialog = doc.createElement(tagName, is);
    doc.body.appendChild(dialog);
    callback(dialog);
  });

  afterEach(() => {
    doc.documentElement.remove();
  });

  return;
}
