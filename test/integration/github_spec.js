var webdriverjs = require('webdriverjs');


var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var fs = require('fs');

describe('Octoblu Login', function () {
  this.timeout(30000);
  var server, client;

  describe('once the server has finally started', function () {
    beforeEach(function (done) {
      server = new SeleniumServer('/usr/local/bin/selenium-server-standalone-2.42.2.jar', {
        port: 4444
      });
      server.start().then(function(){done();});
    });

    afterEach(function () {
      server.stop();
    });

    describe('going to skynet', function () {
      beforeEach(function (done) {
        client = webdriverjs.remote({
          host: 'localhost',
          port: 4444,
          logLevel: 'verbose',
        }).init().call(done);
      });

      afterEach(function (done) {
        client.endAll(done);
      });

      describe('when navigating to the login page', function () {
        beforeEach(function (done) {
          client
          .call(done);
        });

        describe('Getting to the add github page', function () {
          beforeEach(function (done) {
            client
            .url('http://app.octoblu.com/login')
            .waitFor('input[name=email]')
            .setValue('input[name=email]', 'sqrt@octoblu.com')
            .setValue('input[name=password]', 'asdf')
            .submitForm('form')
            .waitFor('i.fa-code-fork', 2000) // Home page has loaded
            .url('http://app.octoblu.com/node-wizard')
            .waitFor('a div[title=Github]', 20000)
            .click('a div[title=Github]')
            .call(done);
          });

          describe('when navigating to the wizard', function () {
            describe('when I activate', function () {
              beforeEach(function (done) {
                client
                .waitFor('.btn-primary', 20000)
                .pause(5000)
                .click('.btn-primary')
                .waitFor('input[name="login"]', 20000)
                .setValue('input[name="login"]', 'square-root-of-saturn')
                .setValue('input[name="password"]', 'INSERT_SECRET_HERE')
                .click('input[name="commit"]')
                .waitFor('*=Authorize')
                .call(done);
              });

              it('should take a screenshot', function (done) {
                client.saveScreenshot('/tmp/render.png').call(done);
              });
            });
          });
        });
      });
    });
  });
});


