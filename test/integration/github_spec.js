casper.test.begin('login to the app', function(test){
  casper
  .start('http://localhost:8080')
  .then(function(){

    // this.fill('form', {
    //   'email':    'john.connor@mailinator.com',
    //   'password': 'judgementday'
    // });

    this.evaluate(function(){
      $('input[name=email]').val('john.connor@mailinator.com').trigger('input');
      $('input[name=password]').val('judgementday').trigger('input');
      $('.btn-primary').click();
    });

    casper.waitForText('Welcome to Octoblu!', function(){
      casper.capture('/tmp/render.png');
      test.assertTextExists('Welcome to Octoblu!');
    }, function(){
      casper.capture('/tmp/render.png');
      test.fail('Logging in to Octoblu timed out');
    }, 10000);

  }).run(function(){
    test.done();
  });
});
