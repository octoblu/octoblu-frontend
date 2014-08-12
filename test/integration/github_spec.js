
casper.test.begin('login to the app', function(test){
  casper
  .start('http://staging.octoblu.com')
  .then(function(){
    casper.fill('form', {
      'email':    'john.connor@mailinator.com',
      'password': 'judgementday'
    });


    casper.options.onResourceRequested = function(casper, options){
      if(options.method !== 'POST') { return; }

      console.log(options.method, options.url, JSON.stringify(options.headers));
    }

    casper.options.onResourceReceived = function(casper, options){
      console.log(options.url, options.status);
    }

    casper.evaluate(function(){
      $('.btn-primary').click();
    });

    return casper.wait(5000);
  })
  .then(function(){
    casper.capture('/tmp/render.png');
    return casper.waitForText('Welcome to Octoblu!');
  })
  .then(function(){
    casper.capture('/tmp/render.png');
    test.assertTextExists('Welcome to Octoblu!');
  })
  .run(function(){
    test.done();
  });
});
