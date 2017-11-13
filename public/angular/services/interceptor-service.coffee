class InterceptorService
  constructor: ($window, $q, $cookies, $location, $rootScope, MESHBLU_HOST) ->
    @window = $window
    @q = $q
    @location = $location
    @uuid = $cookies.meshblu_auth_uuid
    @rootScope = $rootScope
    @MESHBLU_HOST = MESHBLU_HOST
    @OCTOBLU_HOSTNAME = location.hostname

  handle: (response) =>
    return response if response.status < 400
    return @handleAuthError response if response.status in [401, 403]
    return @handleProfileUpdate response if response.status == 412
    return @handleServerError response if response.status in [502, 503, 504]
    return response

  handleAuthError: (response) =>
    { url } = response.config
    return response unless url?
    return response if url.indexOf(@OCTOBLU_HOSTNAME) < 0 && url.indexOf(@MESHBLU_HOST) < 0
    return response if _.get(response, 'data.uuid') != @uuid && url.indexOf('/api/auth') < 0
    return @goTo '/login', response

  handleProfileUpdate: (response) =>
    { url } = response.config
    return response unless url?
    return response unless url.indexOf(@OCTOBLU_HOSTNAME) >= 0
    return @goTo '/profile/new', response

  handleServerError: =>
    @rootScope.showErrorState = true
    return false

  goTo: (path, response) =>
    return response if @window.location.pathname == path
    return "#{path}?callbackUrl=" + encodeURIComponent(@location.url())

angular.module("octobluApp").service "InterceptorService", InterceptorService
