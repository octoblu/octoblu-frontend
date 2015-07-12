var gulp         = require('gulp'),
  bower          = require('gulp-bower'),
  mainBowerFiles = require('main-bower-files'),
  concat         = require('gulp-concat'),
  less           = require('gulp-less'),
  plumber        = require('gulp-plumber'),
  sourcemaps     = require('gulp-sourcemaps'),
  webserver      = require('gulp-webserver'),
  coffee         = require('gulp-coffee'),
  clean          = require('gulp-clean'),
  cors           = require('cors'),
  _              = require('lodash');

gulp.task('bower', function() {
  bower('./public/lib');
});

gulp.task('bower:concat', ['bower'], function(){
  return gulp.src(mainBowerFiles({filter: /\.js$/}))
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(concat('dependencies.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

gulp.task('less:compile', function(){
  return gulp.src('./assets/less/manifest.less')
    .pipe(sourcemaps.init())
    .pipe(less().on('error', function(err){
      console.error(err);
      this.emit('end');
    }))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/stylesheets/dist/'));
});


gulp.task('coffee:clean', function(){
  return gulp.src(['./public/angular/compiled'], {read: false})
    .pipe(clean())
})

gulp.task('coffee:compile', function(){
  var environment = process.env.NODE_ENV || 'development'
  var configFile = "./public/config/" + environment + ".coffee"

  return gulp.src(['./public/angular/**/*.coffee', configFile])
    .pipe(plumber())
    .pipe(coffee({bare: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/angular/compiled/'));
});

gulp.task('javascript:concat', ['coffee:compile'], function(){
  return gulp.src(['./public/angular/app.js', './public/angular/**/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(concat('application.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

gulp.task('default', ['bower:concat', 'less:compile', 'javascript:concat'], function() {});

gulp.task('static', function(){

  var port = process.env.OCTOBLU_FRONTEND_PORT || 8080;
  process.env.PORT = port;

  gulp.src('./public').pipe(webserver({
    host: '0.0.0.0',
    port: port,
    livereload: false,
    directoryListing: false,
    open: false,
    fallback: 'index.html',
    middleware: [cors()],
    proxies: [{
      source: '/api',
      target: 'http://localhost:8081/api'
      }]
  }));
});

gulp.task('watch', ['default', 'static'], function() {
  gulp.watch(['./bower.json'], ['bower']);
  gulp.watch(['./assets/less/**/*.less'], ['less:compile']);
  gulp.watch(['./public/angular/**/*.js', './public/angular/*.js'], ['javascript:concat']);
  gulp.watch(['./public/config/*.coffee','./public/angular/**/*.coffee', './public/angular/*.coffee'], ['coffee:clean', 'coffee:compile']);
});
