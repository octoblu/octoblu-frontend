// Karma configuration
// Generated on Thu Jul 24 2014 17:22:33 GMT-0700 (MST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'public',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
        "lib/angular/angular.js",
        "lib/lodash/lodash.js",
        "lib/d3/d3.js",
        "lib/angular-ui-router/release/angular-ui-router.js",
        "lib/angular-mocks/angular-mocks.js",
        "lib/moment/moment.js",
        "lib/jquery/dist/jquery.js",
        "lib/node-uuid/uuid.js",
        "lib/eventEmitter/EventEmitter.js",
        "**/*.html",
        "../test/angular/test_helper.js",
        "angular/config/**/*.js",
        "angular/controllers/**/*.js",
        "angular/directives/**/*.js",
        "angular/models/**/*.js",
        "angular/services/**/*.js",
        "../test/angular/**/*-spec.js",
        "../test/angular/**/*-spec.coffee",
        "angular/**/*.coffee"
    ],

    // list of files to exclude
    exclude: [

    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.html': 'ng-html2js',
      '../test/**/*.coffee':  ['coffee'],
      'angular/**/*.coffee':  ['coffee']
    },

    coffeePreprocessor: {
      // options passed to the coffee compiler
      options: {
        bare: false,
        sourceMap: true
      },
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    },
    ngHtml2JsPreprocessor: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'growl'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    // browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false

  });
};
