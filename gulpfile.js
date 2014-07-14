var gulp = require('gulp'),
  concat = require('gulp-concat'),
    less = require('gulp-less');


gulp.task('less:compile', function(){
  gulp.src('./assets/less/manifest.less')
    .pipe(less())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/assets/stylesheets/dist/'));
});

gulp.task('default', ['less:compile'], function() {
  gulp.watch(['./assets/less/**/*.less'], ['less:compile']);
});
