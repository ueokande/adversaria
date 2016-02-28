import * as helper from "../../test_helper";

describe("user-settings-dialog", () => {
  let dialog = undefined;
  helper.useComponent(
    "../../build/views/components/user-settings-dialog/user-settings-dialog.html",
    (_) => { dialog = _; },
    "dialog", "adv-user-settings-dialog");

  describe("events", () => {
    it("emit select_directory event", (done) => {
      dialog.addEventListener("select_directory", () => { done(); });
      dialog.querySelector(".show-directory-dialog").click();
    });
  });

  describe("projectPath property", () => {
    it("visible project path", () => {
      dialog.projectPath = "/hoge/fuga/piyo";
      assert.equal(dialog.querySelector(".current-directory").value,
                   "/hoge/fuga/piyo");
    });

    it("returns project path", () => {
      dialog.querySelector(".current-directory").value = "/hoge/fuga/piyo";
      assert.equal(dialog.projectPath, "/hoge/fuga/piyo");
    });
  });
});
