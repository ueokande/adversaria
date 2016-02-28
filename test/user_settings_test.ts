import * as fs from "fs";
import * as settings from "../build/user_settings";

describe("UserSettings class", () => {
  let stubbedHome = process.env.HOME = "/tmp";

  before((done) => {
    fs.mkdirSync("/tmp/.adversaria");
    fs.writeFileSync("/tmp/.adversaria/config.json",
                     '{ "document_path": "/var/example" }');

    stubbedHome = process.env.HOME;
    process.env.home = "/tmp";

    done();
  });

  after((done) => {
    fs.unlinkSync("/tmp/.adversaria/config.json");
    fs.rmdirSync("/tmp/.adversaria");
    process.env.home = stubbedHome;
    done();
  });

  describe("#configPath", () => {
    it("returns psued config path", () => {
      assert.equal(settings.configPath(), "/tmp/.adversaria/config.json");
    });
  });

  describe("documentPath settings", () => {
    it("returns current document path", () => {
      assert.equal(settings.loadDocumentPath(), "/var/example");
    });

    it("saves new document path", () => {
      settings.saveDocumentPath("/var/new_documents");
      let newData = fs.readFileSync("/tmp/.adversaria/config.json", "utf-8");
      assert.include(newData, "/var/new_documents");
    });
  });
});
