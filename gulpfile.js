var gulp = require('gulp');
var lint = require('gulp-jshint');
var connect = require('gulp-connect')

gulp.task('lint', function() {
  gulp.src('client/*.js')
    .pipe(lint())
    .pipe(lint.reporter('jshint-stylish'));
});

gulp.task('live', function() {
  connect.server({
    root: 'client',
    livereload: true
  });
});

gulp.task('reload', ['lint'], function() {
  gulp.src('client/*')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('client/*', ['reload'])
});

gulp.task('default', ['lint', 'live', 'watch']);