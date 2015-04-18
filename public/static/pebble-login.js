(function(global, $, OCTOBLU_API_URL) {

  function getParam(variable, url) {
    if (!url) url = global.location.href;
    if (!~url.indexOf('?')) {
      return false;
    }
    var query = url.split('?')[1];
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return false;
  }

  function closeSettings(uuid, token){
  	global.location.href = "pebblejs://close#" + encodeURIComponent(JSON.stringify({
      uuid: uuid,
      token: token
    }));
  }

  function checkUrl(){
  	var url 		 = global.location.href,
  			uuidTest = /\?uuid=(.+)$/.exec(url);
    if (uuidTest) {
      var uuid 	= getParam('uuid', url),
        	token = getParam('token', url);
      // Set new Skynet Tokens
      if (uuid && token) {
        console.log('Verified Credentials');
        closeSettings(uuid, token);
      }
    }
  }

  function loginViaProvider(provider) {
    var url = OCTOBLU_API_URL + '/api/oauth/' + provider;
    url += '?mobile=true&referrer=' + encodeURIComponent('/static/pebble-login.html');
    global.open(url, '_self', 'location=no,toolbar=no');
  }

  $(document).ready(function() {

  	checkUrl();

    $('.login-via-provider').click(function(e) {
      e.preventDefault();
      loginViaProvider($(this).attr('data-provider'));
      return false;
    });

    $('#loginForm').submit(function(e) {
      e.preventDefault();
      $.post(OCTOBLU_API_URL + '/api/auth', {
        email: $('#email').val(),
        password: $('#password').val()
      }).success(function(currentUser) {
        closeSettings(currentUser.skynet.uuid, currentUser.skynet.token);
      }).error(function() {
        alert('There was an error signing into Octoblu');
      });
      return false;
    });
  });

})(window, jQuery);
