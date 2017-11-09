class LoginController
  constructor: (AUTHENTICATOR_URIS, $location, $cookies, $stateParams) ->
    @stateParams = $stateParams
    protocol     = $location.protocol()
    host         = $location.host()
    port         = $location.port()

    @loggingIn = true

    callbackUrl = $location.search().callbackUrl
    callbackParams = encodedCallbackParams = ''
    encodedCallbackParams = $.param callbackUrl: encodeURIComponent(callbackUrl) if callbackUrl?
    callbackParams = $.param callbackUrl: callbackUrl if callbackUrl?

    encodedLoginParams = $.param callback: "#{protocol}://#{host}:#{port}/api/session?#{encodedCallbackParams}"
    loginParams = $.param callback: "#{protocol}://#{host}:#{port}/api/session?#{callbackParams}"

    @emailPasswordLoginUri = AUTHENTICATOR_URIS.EMAIL_PASSWORD + '?' + encodedLoginParams
    @signUpUri             = AUTHENTICATOR_URIS.EMAIL_PASSWORD + '/signup?' + loginParams

angular.module('octobluApp').controller 'LoginController', LoginController
