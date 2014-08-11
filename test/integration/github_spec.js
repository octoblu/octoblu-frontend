casper.test.begin('login to the app', 1, function(test){
  casper.start('http://app.octoblu.com', function(){
    this.fill('form', {
      'email':    'john.connor@mailinator.com',
      'password': 'judgementday'
    }, true);

    casper.waitForText('Welcome to Octoblu!',function(){
      casper.capture('/tmp/render.png');
      test.assertTextExists('Welcome to Octoblu!');
    });

  }).run(function(){
    test.done();
  });
});
