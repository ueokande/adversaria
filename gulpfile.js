var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var filter = require('gulp-filter');
var print = require('gulp-print');
var taskListing = require('gulp-task-listing');
var del = require('del');
var bower = require('gulp-bower');
var tsd = require('gulp-tsd');
var typescript = require('gulp-typescript');
var sass = require('gulp-sass');
var electron = require('electron-connect').server.create();
var mocha = require('gulp-mocha');
var fs = require('fs');
var path = require('path');

function outputFile(input) {
  var origin = input;
  if (input.match(__dirname) != null) {
    [
      [path.join(__dirname, 'src'), path.join(__dirname, 'build')],
      [path.join(__dirname, 'test'), path.join(__dirname, 'test-build')]
    ].forEach(function(ptn) {
      input = input.replace(ptn[0], ptn[1]);
    });
  } else {
    [
      [/src\//, 'build/'],
      [/test\//, 'test-build/']
    ].forEach(function(ptn) {
      input = input.replace(ptn[0], ptn[1]);
    });
  }
  [
    [/\.ts/, '.js'],
    [/\.scss/, '.css']
  ].forEach(function(ptn) {
    input = input.replace(ptn[0], ptn[1]);
  });
  return input;
}

function needToCompile(input) {
  input = input.path;
  var output = outputFile(input);
  try {
    fs.accessSync(output);
  } catch(e) {
    return true;
  }
  var input_mtime = fs.statSync(input).mtime;
  var output_mtime = fs.statSync(output).mtime;
  return input_mtime > output_mtime;
}

function showBuild(compile) {
  return function(input) {
    return "[BUILD] " + compile +
           " " + input.replace(__dirname, '') +
           " => " + outputFile(input).replace(__dirname, '');
  }
}

gulp.task('help', taskListing);

gulp.task('build', function(){
  var typescript_glob = 'src/**/*.ts';
  var stylesheet_glob = 'src/**/*.{sass,scss}';
  var static_glob = 'src/**/*.{html,css,js}';

  gulp.src([typescript_glob])
  .pipe(filter(needToCompile))
  .pipe(print(showBuild('tsc')))
  .pipe(addsrc('./typings/tsd.d.ts'))
  .pipe(typescript({ target: 'es5',
                     module: 'commonjs',
                     sourceMap: true }))
  .js
  .pipe(gulp.dest('build'));

  gulp.src(stylesheet_glob)
  .pipe(filter(needToCompile))
  .pipe(print(showBuild('sass')))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('build'));

  gulp.src(
    [static_glob],
    { base: 'src' }
  )
  .pipe(filter(needToCompile))
  .pipe(print(showBuild('clone')))
  .pipe(gulp.dest('build'));
});

gulp.task('watch', function(){
  gulp.watch('{test,src}/**/*', ['build']);
});

gulp.task('clean', function(cb) {
  del(['build', 'test-build'], cb);
});


gulp.task('build:test', ['build'], function() {
  gulp.src(['test/**/*.ts'])
    .pipe(filter(needToCompile))
    .pipe(print(showBuild('tsc')))
    .pipe(addsrc('./typings/tsd.d.ts'))
    .pipe(typescript({ target: 'es5',
                       module: 'commonjs',
                       sourceMap: true }))
    .js
    .pipe(gulp.dest('test-build'));

  gulp.src(
    ['test/**/*.js', 'test/testdata/*'],
    { base: 'test' }
  )
  .pipe(filter(needToCompile))
  .pipe(print(showBuild('clone')))
  .pipe(gulp.dest('test-build'));
});

gulp.task('test', ['build:test'], function() {
  return gulp.src(['test-build/**/*_test.js'], { read: false })
    .pipe(mocha({ reporter: 'dot'}));
});

gulp.task('serve', ['watch'], function () {
  electron.start();

  // Restart electron when resources loaded from BrowserProcess updates
  gulp.watch(['build/browser/**/*.js'], electron.restart);

  // Reload a page when resources loaded from RendererProcess updates
  gulp.watch(['build/renderer/**/*.{html,js,css}'], electron.reload);
});

gulp.task('install', ['install:bower', 'install:tsd']);

gulp.task('install:bower', function() {
  return bower();
});

gulp.task('install:tsd', function(callback) {
  tsd({ command: 'reinstall',
        config: 'tsd.json'
      }, callback);
});
