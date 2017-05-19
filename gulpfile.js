var gulp         = require('gulp'),
  bower          = require('gulp-bower'),
  mainBowerFiles = require('main-bower-files'),
  chalk          = require('chalk'),
  concat         = require('gulp-concat'),
  rename         = require('gulp-rename'),
  less           = require('gulp-less'),
  plumber        = require('gulp-plumber'),
  sourcemaps     = require('gulp-sourcemaps'),
  webserver      = require('gulp-webserver'),
  coffee         = require('gulp-coffee'),
  rimraf         = require('gulp-rimraf'),
  cors           = require('cors'),
  _              = require('lodash'),
  replace        = require('gulp-replace'),
  cleanCSS       = require('gulp-clean-css'),
  uglify         = require('gulp-uglify');

gulp.task('bower:clean', function() {
  return gulp.src(['./public/lib-assets'])
    .pipe(rimraf())
})

gulp.task('bower', ['bower:clean'], function() {
  return bower('./public/lib');
});

gulp.task('bower:concat', ['bower'], function(){
  return gulp.src(mainBowerFiles({filter: /\.js$/}))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('dependencies.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

var bowerAssets = [
  './public/lib/ace-builds/src-noconflict/ace.js',
  './public/lib/ace-builds/src-noconflict/mode-javascript.js',
  './public/lib/ace-builds/src-noconflict/mode-json.js',
  './public/lib/ace-builds/src-noconflict/theme-chrome.js',
  './public/lib/ace-builds/src-noconflict/worker-javascript.js',
  './public/lib/ace-builds/src-noconflict/worker-json.js',
  './public/lib/zeroclipboard/dist/ZeroClipboard.swf',
]

gulp.task('bower:build', ['bower:concat'], function() {
  return gulp.src(bowerAssets, { base: '.' })
    .pipe(plumber())
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace('public/lib', '')
    }))
    .pipe(gulp.dest('./public/lib-assets'))
})

var cssDependencies = [
  './public/lib/fontawesome/css/font-awesome.css',
  './public/lib/prism/themes/prism-coy.css',
  './public/lib/angular-material/angular-material.css',
  './assets/less/**/*.less'
]

gulp.task('less:compile', function(){
  return gulp.src(cssDependencies)
    .pipe(replace('\\0',''))
    .pipe(concat('styles.css'))
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/assets/stylesheets/dist/'));
});

gulp.task('coffee:clean', function(){
  return gulp.src(['./public/angular/compiled'], {read: false})
    .pipe(rimraf())
})

gulp.task('coffee:compile', ['coffee:clean'], function(){
  return gulp.src(['./public/angular/**/*.coffee', './public/config/*.coffee'])
    .pipe(plumber())
    .pipe(coffee())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/angular/compiled/'));
});

gulp.task('javascript:concat', ['coffee:compile'], function(){
  return gulp.src(['./public/angular/app.js', './public/angular/**/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('application.js'))
    .pipe(uglify({mangle:false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

gulp.task('build', ['less:compile', 'javascript:concat'])

gulp.task('default', ['bower:build', 'less:compile', 'javascript:concat']);

gulp.task('webserver', ['static']);



gulp.task('static-preflight', function(){
  var apiBackendUri = process.env.OCTOBLU_BACKEND_URI;

  if (!apiBackendUri) {
    console.error(chalk.red('\n======================= ERROR =======================\n'))
    console.error(chalk.red('  Missing OCTOBLU_BACKEND_URI environment variable.'))
    console.error(chalk.red('\n======================= ERROR =======================\n'))
    process.exit(1)
    return
  }

  if (!_.endsWith(apiBackendUri, '/api')) {
    console.error(chalk.yellow('\n================== WARNING ==================\n'))
    console.error(chalk.yellow('    OCTOBLU_BACKEND_URI should end with /api'))
    console.error(chalk.yellow('    you probably want: "'+apiBackendUri+'/api"'))
    console.error(chalk.yellow('\n================== WARNING ==================\n'))
  }
})

gulp.task('static', ['static-preflight', 'default'], function(){
  var port = process.env.PORT || 80;
  var apiBackendUri = process.env.OCTOBLU_BACKEND_URI;

  return gulp.src('./public').pipe(webserver({
    host: '0.0.0.0',
    port: port,
    livereload: false,
    directoryListing: false,
    open: false,
    fallback: 'index.html',
    middleware: [cors()],
    proxies: [{
      source: '/api',
      target: apiBackendUri
    }]
  }));
});

var onChange = function(name) {
  return function(event) {
    console.log(name + ' : ' + event.path + ' was ' + event.type);
  }
}

var watchConfig = { interval: 3000, usePoll: true }

gulp.task('watch', ['static'], function() {
  gulp.watch(['./bower.json'], watchConfig, ['bower'])
    .on('change', onChange('bower'));
  gulp.watch(['./assets/less/**/*.less'], watchConfig, ['less:compile'])
    .on('change', onChange('less'));
  gulp.watch(['./public/angular/!(compiled)/**/*.js', './public/angular/*.js'], watchConfig, ['javascript:concat'])
    .on('change', onChange('concat'));
  gulp.watch(['./public/config/*.coffee','./public/angular/**/*.coffee', './public/angular/*.coffee'], watchConfig, ['coffee:compile', 'javascript:concat'])
    .on('change', onChange('coffee'));
});
