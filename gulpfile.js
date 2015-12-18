var gulp = require('gulp');
var tsd = require('gulp-tsd');
var typescript = require('gulp-typescript');

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
    ['src/*.html', 'src/*.js'],
    { base: 'src' }
  )
  .pipe(gulp.dest('build'));
});

gulp.task('install', ['install:tsd']);
gulp.task('install:tsd', function(callback) {
  tsd({ command: 'reinstall',
        config: 'tsd.json'
      }, callback);
});
