var gulp         = require('gulp'),
  bower          = require('gulp-bower'),
  sourcemaps     = require('gulp-sourcemaps'),
  mainBowerFiles = require('main-bower-files'),
  concat         = require('gulp-concat'),
  less           = require('gulp-less'),
  plumber        = require('gulp-plumber');

gulp.task('bower', function() {
  bower('./assets/lib');
});

gulp.task('bower:javascript:concat', ['bower'], function(){
  return gulp.src(mainBowerFiles({filter: /\.js/}))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('dependencies.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

gulp.task('bower:stylesheet:concat', ['bower'], function(){
  return gulp.src([
    './assets/lib/bootstrap/less/bootstrap.less',
    './assets/lib/fontawesome/less/font-awesome.less'
    ])
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('dependencies.css'))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/stylesheets/dist/'));
});

gulp.task('bower:fonts:copy', ['bower'], function(){
  return gulp.src([
    './assets/lib/bootstrap/fonts/*',
    './assets/lib/fontawesome/fonts/*'
    ])
    .pipe(gulp.dest('./public/assets/stylesheets/fonts/'));
});

gulp.task('less:compile', function(){
  gulp.src('./assets/less/manifest.less')
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('styles.css'))
    // .pipe(sourcemaps.write('.'))
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

gulp.task('default', [
  'bower:fonts:copy',
  'bower:stylesheet:concat',
  'bower:javascript:concat',
  'less:compile',
  'javascript:concat'
  ], function() {
});

gulp.task('watch', ['default'], function() {
  gulp.watch(['./bower.json'], ['bower:fonts:copy', 'bower:stylesheet:concat', 'bower:javascript:concat']);
  gulp.watch(['./assets/less/**/*.less'], ['less:compile']);
  gulp.watch(['./public/angular/**/*.js'], ['javascript:concat']);
});
