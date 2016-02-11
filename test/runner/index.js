var remote = require('remote')
var remoteConsole = remote.require('console')
var ipc = require('ipc')
var Mocha = require('mocha')
var path = require('path')
var glob = require("glob")

console.log = function () {
  remoteConsole.log.apply(remoteConsole, arguments)
}

console.dir = function () {
  remoteConsole.dir.apply(remoteConsole, arguments)
}

Object.defineProperty(process, 'stdout', {
  value: remote.process.stdout
})

window.onerror = function (message, filename, lineno, colno, err) {
  ipc.send('mocha-error', {
    message: message,
    filename: filename,
    err: err,
    stack: err.stack
  })
}

Error.stackTraceLimit = Infinity

var mocha = new Mocha()
mocha.reporter('dot');
mocha.ui('bdd');
mocha.files = glob.sync('test-build/**/*_test.js')
mocha.run(function(failureCount){
  ipc.send('mocha-done', failureCount)
});
