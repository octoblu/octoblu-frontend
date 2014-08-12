var webdriverjs = require('webdriverjs');


var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var fs = require('fs');

// var octoblu_host = 'http://localhost:8080';
var octoblu_host = 'http://app.octoblu.com';

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

      describe('when logged in', function () {
        beforeEach(function (done) {
          client
          .url(octoblu_host + '/login')
          .waitFor('input[name=email]')
          .setValue('input[name=email]', 'sqrt@octoblu.com')
          .setValue('input[name=password]', 'asdf')
          .submitForm('form')
          .waitFor('i.fa-code-fork', 20000) // Home page has loaded
          .call(done);
        });

        describe('deactivating all octoblu channels', function () {
          beforeEach(function(done){
            client
            .url(octoblu_host + '/clearauth')
            .waitFor('.btn-extreme-danger', 20000)
            .click('.btn-extreme-danger')
            .waitFor('h1.channels-cleared', 20000)
            .call(done);
          });

          describe('when the app has been deauthorized on github', function () {
            beforeEach(function (done) {
              client
              .url('https://github.com')
              .deleteCookie('user_session')
              .url('https://github.com')
              .waitFor('*=Sign in', 20000)
              .click('*=Sign in')
              .waitFor('input[name="login"]', 20000)
              .setValue('input[name="login"]', 'square-root-of-saturn')
              .setValue('input[name="password"]', 'INSERT_SECRET_HERE')
              .click('input[name="commit"]')
              .waitFor('#account_settings', 20000) // login finished
              .url('https://github.com/settings/applications')
              .waitFor('*=Revoke all')
              .click('*=Revoke all')
              .pause(2000)
              .setValue('.facebox .input-block', 'square-root-of-saturn')
              .click('.facebox button.danger') // Push the danger button
              .pause(5000)
              .click('.sign-out-button')
              .pause(5000)
              .call(done);
            });

            describe('Getting to the add github page', function () {
              beforeEach(function (done) {
                client
                .url(octoblu_host + '/node-wizard')
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
                    .waitFor('.button.primary')
                    .click('.button.primary')
                    .call(done);
                  });

                  it('should have a btn-success', function (done) {
                    client
                    .waitFor('.fa-code-fork', 20000)
                    .getText('.pull-right .btn', function(error,text){
                      expect(text).to.equal('Active');
                    })
                    .call(done);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
