// to run a single browser:
// karma start karma.conf-ci.js --browsers SL_Chrome

var fs = require('fs');

module.exports = function(config) {

  // Use ENV vars on Travis and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    'SL_IE_10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

  if (process.env.TRAVIS) {
    var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';

    config.logLevel = config.LOG_DEBUG;
    // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
    config.browserNoActivityTimeout = 120000;

    config.browserStack.build = buildLabel;
    config.browserStack.startTunnel = false;
    config.browserStack.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;

    config.sauceLabs.build = buildLabel;
    config.sauceLabs.startConnect = false;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.sauceLabs.recordScreenshots = true;

    // Debug logging into a file, that we print out at the end of the build.
    config.loggers.push({
      type: 'file',
      filename: process.env.LOGS_DIR + '/' + (specificOptions.logFile || 'karma.log')
    });

    if (process.env.BROWSER_PROVIDER === 'saucelabs' || !process.env.BROWSER_PROVIDER) {
      // Allocating a browser can take pretty long (eg. if we are out of capacity and need to wait
      // for another build to finish) and so the `captureTimeout` typically kills
      // an in-queue-pending request, which makes no sense.
      config.captureTimeout = 0;
    }
  }

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

    preprocessors: {
      '**/*.html': 'ng-html2js',
      '../test/angular/**/*.coffee':  ['coffee'],
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

    port: 9876,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'saucelabs'],

    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    sauceLabs: {
      testName: 'Octoblu Cross Browser Test'
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers),
    singleRun: true


  });
};
