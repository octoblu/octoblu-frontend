class SignupController
  constructor: (AUTHENTICATOR_URIS, $location) ->
    protocol = $location.protocol()
    host     = $location.host()
    port     = $location.port()

    callbackUrl = $location.search().callbackUrl
    callbackParams = ''
    callbackParams = $.param callbackUrl: callbackUrl if callbackUrl?

    loginParams = $.param callback: "#{protocol}://#{host}:#{port}/api/session?#{callbackParams}"

    @emailPasswordLoginUri = AUTHENTICATOR_URIS.EMAIL_PASSWORD + '?' + loginParams
    @signUpUri             = AUTHENTICATOR_URIS.EMAIL_PASSWORD + '/signup?' + loginParams

angular.module('octobluApp').controller 'SignupController', SignupController
