var gulp = require('gulp');
var lint = require('gulp-jshint');
var connect = require('gulp-connect');
var nodemon = require('gulp-nodemon');

gulp.task('lint', function() {
  gulp.src(['app/server/*.js', 'app/client/*.js'])
    .pipe(lint())
    .pipe(lint.reporter('jshint-stylish'));
});

gulp.task('golive', function() {
  connect.server({
    root: 'app/client/',
    livereload: true
  });

  nodemon({script: 'app/server/'})
    .on('change', ['lint'])
    .on('restart', function() {
      console.log('nodemon restarted');
    });
});

gulp.task('reload', ['lint'], function() {
  gulp.src('.')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['app/client/*.{js,html,css}'], ['reload']);
});

gulp.task('default', ['lint', 'golive', 'watch']);