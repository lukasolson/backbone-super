var gulp = require('gulp'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify');

gulp.task('compress', function() {
  gulp.src('backbone-super/backbone-super.js')
    .pipe(uglify())
    .pipe(rename('backbone-super-min.js'))
    .pipe(gulp.dest('backbone-super'));
});
