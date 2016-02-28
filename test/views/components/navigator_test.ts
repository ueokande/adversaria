import * as helper from "../../test_helper";

describe("navigator", () => {
  let nav = undefined;
  helper.useComponent(
    "../../build/views/components/navigator/navigator.html",
    (_) => { nav = _; },
    "ul", "adv-navigator");

  let tree = {
    usr: {
      bin: {},
      lib: { git: {} },
      share: { git: {} },
    },
    etc: { git: {} }
  };
  beforeEach(() => {
    nav.setDirectoryTree(tree);
  });

  describe("elements", () => {

    it("has collapsible checkbox", () => {
      let doc = nav.ownerDocument;
      let usrLibCheck = doc.getElementById("collapsible-/usr/lib");
      assert.ok(usrLibCheck);
      assert.equal(usrLibCheck.type, "checkbox");
    });

    it("doee not have collapsible checkbox for leaf directory", () => {
      let doc = nav.ownerDocument;
      let usrBinCheck = doc.getElementById("collapsible-/usr/bin");
      assert.notOk(usrBinCheck);
    });

    it("has selectable radio button", () => {
      let doc = nav.ownerDocument;
      let etcGitRadio = doc.getElementById("/etc/git");
      assert.ok(etcGitRadio);
      assert.equal(etcGitRadio.type, "radio");
    });
  });

  describe("events", () => {
    it("emits directory_click events", (done) => {
      let doc = nav.ownerDocument;
      let etcGitRadio = doc.getElementById("/etc/git");
      nav.addEventListener("directory_click", (e) => {
        assert.equal(e.detail.directory, "/etc/git");
        done();
      });
      etcGitRadio.click();
    });
  });
});
