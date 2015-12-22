var assert = require('chai').assert;
var fs = require('fs');
var settings = require('../../build/browser/user_settings');

describe('UserSettings class', () => {
  var stub = null;
  var stubbed_home = process.env.HOME = '/tmp'

  before((done) => {
    fs.mkdirSync('/tmp/.adversaria');
    fs.writeFileSync('/tmp/.adversaria/config.json',
                     '{ "document_path": "/var/example" }');

    stubbed_home = process.env.HOME;
    process.env.home = '/tmp';

    done();
  });

  after((done) => {
    fs.unlinkSync('/tmp/.adversaria/config.json');
    fs.rmdirSync('/tmp/.adversaria');
    process.env.home = stubbed_home;
    done();
  });

  describe('#configPath', () => {
    it('returns psued config path', () => {
      assert.equal(settings.configPath(), '/tmp/.adversaria/config.json');
    });
  });

  describe('documentPath settings', () => {
    it('returns current document path', () => {
      assert.equal(settings.loadDocumentPath(), '/var/example');
    });

    it('saves new document path', () => {
      settings.saveDocumentPath('/var/new_documents');
      var new_data = fs.readFileSync('/tmp/.adversaria/config.json', 'utf-8');
      assert.include(new_data, '/var/new_documents');
    });
  });
});
