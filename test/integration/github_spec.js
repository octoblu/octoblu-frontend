var webdriverjs = require('webdriverjs');


var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var fs = require('fs');

xdescribe('Octoblu Login', function () {
  this.timeout(10000);

  var driver, server;
  beforeEach(function () {
    server = new SeleniumServer('/usr/local/bin/selenium-server-standalone-2.42.2.jar', {
      port: 4444
    });
    server.start();
    driver = new webdriver
                .Builder()
                .usingServer(server.address())
                .withCapabilities(webdriver.Capabilities.firefox())
                .build();
  });

  afterEach(function () {
    driver.quit();
    server.stop();
  });

  describe('when I go to the login page', function () {
    beforeEach(function (done) {
      driver.get('http://localhost:8080/login').then(done);
    });

    describe('and I fill in the login form', function () {
      beforeEach(function (done) {
        var email    = driver.findElement(webdriver.By.name('email'));
        email.sendKeys('john.connor@mailinator.com');
        var password = driver.findElement(webdriver.By.name('password'));
        password.sendKeys('judgementday');
        password.submit().then(done);
      });

      it('should login', function (done) {
        driver.takeScreenshot().then(function(data) {
          fs.writeFileSync('/tmp/render.png', data, 'base64');
          done();
        });

        // var h1 = driver.findElement(webdriver.By.tagName('h1'));
        // h1.getText().then(function(text){
        //   expect(text).to.contain('Octoblu');
        //   done();
        // });
      });
    });
  });
});

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
        client = webdriverjs.remote({ host: 'localhost', port: 4444 }).init().call(done);
      });

      afterEach(function (done) {
        client.endAll(done);
      });

      describe('when the login form is filled out', function () {
        beforeEach(function (done) {
          client
          .url('http://app.octoblu.com/login')
          .waitFor('input[name=email]')
          .setValue('input[name=email]', 'sqrt@octoblu.com')
          .setValue('input[name=password]', 'asdf')
          .submitForm('form')
          .call(done);
        });

        describe('activating github', function () {
          beforeEach(function (done) {
            client
            .waitFor('a[text="Connect"]')
            .click('a[text="Connect"]')
            .waitFor('a div[title=Github]')
            .click('a div[title=Github]')
            .buttonClick('.btn-primary')
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


