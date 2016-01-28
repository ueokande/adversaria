var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var filter = require('gulp-filter');
var print = require('gulp-print');
var del = require('del');
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

gulp.task('build:src', gulp.parallel(function() {
  return gulp.src('src/**/*.ts')
  .pipe(filter(needToCompile))
  .pipe(print(showBuild('tsc')))
  .pipe(addsrc('./typings/tsd.d.ts'))
  .pipe(typescript({ target: 'es5',
                     module: 'commonjs',
                     sourceMap: true }))
  .js
  .pipe(gulp.dest('build'));
}, function() {
  return gulp.src('src/**/*.{sass,scss}')
  .pipe(filter(needToCompile))
  .pipe(print(showBuild('sass')))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('build'));
}, function() {
  return gulp.src('src/**/*.{html,css,js}', { base: 'src' })
  .pipe(filter(needToCompile))
  .pipe(print(showBuild('clone')))
  .pipe(gulp.dest('build'));
}));

gulp.task('build:test', gulp.parallel(function() {
  return gulp.src('test/**/*.ts')
    .pipe(filter(needToCompile))
    .pipe(print(showBuild('tsc')))
    .pipe(addsrc('./typings/tsd.d.ts'))
    .pipe(typescript({ target: 'es5',
                       module: 'commonjs',
                       sourceMap: true }))
    .js
    .pipe(gulp.dest('test-build'));
}, function() {
  return gulp.src(['test/**/*.js', 'test/testdata/**/*'], { base: 'test' })
  .pipe(filter(needToCompile))
  .pipe(print(showBuild('clone')))
  .pipe(gulp.dest('test-build'));
}));

gulp.task('build', gulp.parallel('build:src', 'build:test'));

gulp.task('watch', function() {
  gulp.watch('{test,src}/**/*', gulp.series('build'));
});

gulp.task('clean', function() {
  return del(['build', 'test-build']);
});

gulp.task('test', function() {
  return gulp.src(['test-build/**/*_test.js'])
    .pipe(mocha({ reporter: 'dot'}));
});

gulp.task('serve', function () {
  electron.start();

  // Restart electron when resources loaded from BrowserProcess updates
  gulp.watch('build/browser/**/*.js', electron.restart);

  // Reload a page when resources loaded from RendererProcess updates
  gulp.watch('build/renderer/**/*.{html,js,css}', electron.reload);
});
