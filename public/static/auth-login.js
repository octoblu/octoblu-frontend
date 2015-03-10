(function(global, $) {

	var rootUrl = '//' + global.location.host;

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
  	console.log('Closing', uuid, token);
  	global.location.href = rootUrl + "/static/auth-login-success.html?uuid=" + uuid + "&token=" + token;
  }

  function loginViaProvider(provider) {
    var url = '/api/oauth/' + provider;
    url += '?mobile=true&referrer=' + encodeURIComponent(rootUrl + '/static/auth-login-success.html');
    global.open(url, '_self', 'location=no,toolbar=no');
  }

  $(document).ready(function() {
    if($('#creds').size()){
      var uuid = getParam('uuid');
      var token = getParam('token');
      if(uuid && token){
        $('#creds').attr('data-uuid', uuid);
        $('#creds').attr('data-token', token);
      }
    }


    $('.login-via-provider').click(function(e) {
      e.preventDefault();
      loginViaProvider($(this).attr('data-provider'));
      return false;
    });

    $('#loginForm').submit(function(e) {
      e.preventDefault();
      $.post('/api/auth', {
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
