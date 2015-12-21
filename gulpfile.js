var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
var bower = require('gulp-bower');
var tsd = require('gulp-tsd');
var typescript = require('gulp-typescript');
var sass = require('gulp-sass');
var electron = require('electron-connect').server.create();
var mocha = require('gulp-mocha');

gulp.task('help', taskListing);


['browser', 'renderer'].forEach(function(dir){
  var typescript_glob = 'src/' + dir + '/**/*.ts';
  var stylesheet_glob = 'src/' + dir + '/**/*.{sass,scss}';
  var static_glob = 'src/' + dir + '/**/*.{html,css,js}';

  gulp.task('build:' + dir, function(){
    gulp.src([typescript_glob])
    .pipe(typescript({ target: 'es5',
                       module: 'commonjs',
                       sourceMap: true }))
    .js
    .pipe(gulp.dest('build/' + dir));

    gulp.src(stylesheet_glob)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/' + dir));

    gulp.src(
      [static_glob],
      { base: 'src' }
    )
    .pipe(gulp.dest('build'));
  });

  gulp.task('watch:' + dir, function(){
    gulp.watch([typescript_glob, stylesheet_glob, static_glob], ['build:' + dir]);
  });
});

gulp.task('watch', ['watch:browser', 'watch:renderer']);
gulp.task('build', ['build:browser', 'build:renderer']);

gulp.task('build:test', ['build'], function() {
  gulp.src(['test/**/*.ts'])
    .pipe(typescript({ target: 'es5',
                       module: 'commonjs',
                       sourceMap: true }))
    .js
    .pipe(gulp.dest('test-build'));
  gulp.src(
    ['test/**/*.js', 'test/testdata/*'],
    { base: 'test' }
  )
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
