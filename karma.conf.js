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
        "lib/jquery/dist/jquery.js",
        "lib/jquery-ui/ui/jquery-ui.js",

        "lib/angular/angular.js",
        "lib/angular-animate/angular-animate.js",
        "lib/angular-sanitize/angular-sanitize.js",
        "lib/angular-cookies/angular-cookies.js",
        "lib/angular-resource/angular-resource.js",
        "lib/lodash/dist/lodash.js",
        "lib/d3/d3.js",
        "lib/nvd3/nv.d3.js",

        "lib/angular-ui-router/release/angular-ui-router.js",
        "lib/angular-ui-utils/ui-utils.js",
        "lib/angular-google-analytics/src/angular-google-analytics.js",
        "lib/modernizr/modernizr.js",
        "lib/json-editor/dist/jsoneditor.js",
        "lib/angular-bootstrap/ui-bootstrap.js",
        "lib/angular-bootstrap/ui-bootstrap-tpls.js",
        "lib/bootstrap-switch/dist/js/bootstrap-switch.js",
        "lib/elastic.js/dist/elastic.js",
        "lib/elasticsearch/elasticsearch.angular.js",
        "lib/smoothie/smoothie.js",
        "lib/ng-table/ng-table.js",
        "lib/angular-ui-ace/ui-ace.js",
        "lib/angular-dragdrop-ganarajpr/draganddrop.js",
        "lib/node-uuid/uuid.js",

        "lib/angular-mocks/angular-mocks.js",

        "assets/javascripts/skynet.bundle.js",

        "angular/**/*.html",
        "angular/**/*.js",
        "../test/angular/test_helper.js",
        "../test/angular/**/*-spec.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'angular/**/*.html': 'ng-html2js'
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


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
