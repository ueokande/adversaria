import * as helper from "../../test_helper";

describe("ssh-config-dialog", () => {
  let dialog = undefined;
  helper.useComponent(
    "../../build/views/components/ssh-config-dialog/ssh-config-dialog.html",
    (_) => { dialog = _; },
    "dialog", "adv-ssh-config-dialog");

  describe("publicKey property", () => {
    it("visible public key", () => {
      dialog.publicKey = "my_key.pub";
      assert.equal(dialog.querySelector("#public_key").value,
                   "my_key.pub");
    });

    it("returns public key", () => {
      dialog.querySelector("#public_key").value = "my_key.pub";
      assert.equal(dialog.publicKey, "my_key.pub");
    });
  });

  describe("privateKey property", () => {
    it("visible private key", () => {
      dialog.privateKey = "my_key.pub";
      assert.equal(dialog.querySelector("#private_key").value,
                   "my_key.pub");
    });

    it("returns private key", () => {
      dialog.querySelector("#private_key").value = "my_key.pub";
      assert.equal(dialog.privateKey, "my_key.pub");
    });
  });

  describe("passphrase property", () => {
    it("visible passphrase", () => {
      dialog.passphrase = "password";
      assert.equal(dialog.querySelector("#passphrase").value,
                   "password");
    });

    it("returns passphrase", () => {
      dialog.querySelector("#passphrase").value = "password";
      assert.equal(dialog.passphrase, "password");
    });
  });

  describe("authFromKey property", () => {
    it("returns true", () => {
      dialog.querySelector("#auth_from_key").click();
      assert.ok(dialog.authFromKey);
    });
  });

  describe("authFromAgent property", () => {
    it("returns true", () => {
      dialog.querySelector("#auth_from_agent").click();
      assert.ok(dialog.authFromAgent);
    });
  });
});
