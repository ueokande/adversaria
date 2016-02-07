///<reference path='views/components/navigator/navigator.ts'/>

import * as path from 'path';
const DocumentTree = require('./document_tree').DocumentTree;
DocumentTree.FileType = require('./document_tree').FileType;

export default class NavigatorController {
  private element: NavigatorElement;
  private fileSelectCallback: Function;
  private controller: NavigatorController;
  private documentTree: any;

  constructor() {
    this.controller = this;
    this.element = <NavigatorElement>document.getElementById('navigator');
    this.element.onFileClick((filename) => {
      if (!this.documentTree || !this.fileSelectCallback) { return }
      var fullpath = this.documentTree.fullPathOf(filename);
      this.fileSelectCallback(filename, fullpath);
    });
    this.element.onDirectoryClick((dirname) => {
      this.selectDirectory(dirname);
    });
  }

  setDocumentPath(doc_path: string): void {
    this.documentTree = new DocumentTree(doc_path);
    this.selectDirectory('.');
  }

  onFileSelect(callback: Function): void {
    this.fileSelectCallback = callback;
  }

  selectDirectory(dir): void {
    this.documentTree.enter(dir);
    this.element.clearItems();
    this.element.setParentButton(!this.documentTree.isRootDirectory());
    this.documentTree.list((fullpath, filetype) => {
      var basename = path.basename(fullpath);
      if (filetype == DocumentTree.FileType.Directory) {
        this.element.addItem(basename, FileType.Directory);
      } if (filetype == DocumentTree.FileType.Note) {
        this.element.addItem(basename, FileType.File);
      }
    });
  }
}
