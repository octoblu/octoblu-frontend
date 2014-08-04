var   gulp = require('gulp'),
    concat = require('gulp-concat'),
      less = require('gulp-less'),
   plumber = require('gulp-plumber'),
sourcemaps = require('gulp-sourcemaps');

gulp.task('less:compile', function(){
  gulp.src('./assets/less/manifest.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/assets/stylesheets/dist/'));
});

gulp.task('javascript:concat', function(){
  gulp.src(['./public/angular/app.js', './public/angular/**/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(concat('application.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

gulp.task('default', ['less:compile', 'javascript:concat'], function() {
});

gulp.task('watch', ['default'], function() {
  gulp.watch(['./assets/less/**/*.less'], ['less:compile']);
  gulp.watch(['./public/angular/**/*.js'], ['javascript:concat']);
});
