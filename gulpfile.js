var gulp = require('gulp');
var lint = require('gulp-jshint');
var connect = require('gulp-connect');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

gulp.task('lint', function() {
  gulp.src(['app/server/*.js', 'app/client/*.js', '!app/client/build.js'])
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

gulp.task('browserify', function() {
  gulp.src('./app/client/script.js')
    .pipe(browserify())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('./app/client'));
});

gulp.task('reload', ['lint'], function() {
  gulp.src('.')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('app/client/script.js', ['browserify']);
  gulp.watch(['app/client/*.{js,html,css}'], ['reload']);
});

gulp.task('default', ['lint', 'golive', 'browserify', 'watch']);
