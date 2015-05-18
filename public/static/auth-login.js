(function(global, $, OCTOBLU_API_URL) {

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
  	global.location.href = rootUrl + "/static/auth-login-success.html?uuid=" + uuid + "&token=" + token;
  }

	function closePebble(uuid, token){
		global.location.href = "pebblejs://close#" + encodeURIComponent(JSON.stringify({
			uuid: uuid,
			token: token
		}));
	}

  $(document).ready(function() {
    if($('#creds').size()){
      var uuid = getParam('uuid');
      var token = getParam('token');
      if(uuid && token){
        $('#creds').attr('data-uuid', uuid);
        $('#creds').attr('data-token', token);
				var pebble = getParam('closePebble')
				if(pebble === 'true' || pebble === true){
					closePebble(uuid, token)
				}
      }

    }
  });

})(window, jQuery);
