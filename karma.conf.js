// Karma configuration
// Generated on Thu Jul 24 2014 17:22:33 GMT-0700 (MST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
        "public/lib/jquery/dist/jquery.js",
        "public/lib/jquery-ui/ui/jquery-ui.js",

        "public/lib/angular/angular.js",
        "public/lib/angular-animate/angular-animate.js",
        "public/lib/angular-sanitize/angular-sanitize.js",
        "public/lib/angular-cookies/angular-cookies.js",
        "public/lib/angular-resource/angular-resource.js",
        "public/lib/lodash/dist/lodash.js",
        "public/lib/d3/d3.js",
        "public/lib/nvd3/nv.d3.js",

        "public/lib/angular-ui-router/release/angular-ui-router.js",
        "public/lib/angular-ui-utils/ui-utils.js",
        "public/lib/angular-google-analytics/src/angular-google-analytics.js",
        "public/lib/modernizr/modernizr.js",
        "public/lib/json-editor/dist/jsoneditor.js",
        "public/lib/angular-bootstrap/ui-bootstrap.js",
        "public/lib/angular-bootstrap/ui-bootstrap-tpls.js",
        "public/lib/bootstrap-switch/dist/js/bootstrap-switch.js",
        "public/lib/elastic.js/dist/elastic.js",
        "public/lib/elasticsearch/elasticsearch.angular.js",
        "public/lib/smoothie/smoothie.js",
        "public/lib/ng-table/ng-table.js",

        "public/lib/angular-mocks/angular-mocks.js",
        "public/lib/chai/chai.js",

        "public/assets/javascripts/skynet.bundle.js",

        "public/angular/**/*.js",
        "test/angular/test_helper.js",
        "test/angular/**/*-spec.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
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
