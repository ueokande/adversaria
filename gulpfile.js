var gulp = require('gulp');

gulp.task('build', function() {
  return gulp.src(
    ['src/*.html', 'src/*.js'],
    { base: 'src' }
  )
  .pipe(gulp.dest('build'));
});
