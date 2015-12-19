var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
var bower = require('gulp-bower');
var tsd = require('gulp-tsd');
var typescript = require('gulp-typescript');

gulp.task('help', taskListing);

gulp.task('build', ['build:clone',
                    'build:typescript']);

gulp.task('build:typescript', function(){
  gulp.src(['src/**/*.ts'])
    .pipe(typescript({ target: 'es5',
                       module: 'commonjs',
                       sourceMap: true }))
    .js
    .pipe(gulp.dest('build'));
});

gulp.task('build:clone', function() {
  return gulp.src(
    ['src/**/*.{html,css,js}'],
    { base: 'src' }
  )
  .pipe(gulp.dest('build'));
});

gulp.task('watch', ['watch:typescript', 'watch:clone']);

gulp.task('watch:typescript', function(){
  gulp.watch('src/**/*.ts', ['build:typescript']);
});

gulp.task('watch:clone', function(){
  gulp.watch('src/**/*.{html,css}', ['build:clone']);
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
