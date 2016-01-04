class LoginController
  constructor: (AUTHENTICATOR_URIS, $location) ->
    protocol = $location.protocol()
    host     = $location.host()
    port     = $location.port()

    @CWCAccount = host == "octoblu.cloud.com"
    @loggingIn = true

    callbackUrl = $location.search().callbackUrl
    callbackParams = encodedCallbackParams = ''
    encodedCallbackParams = $.param callbackUrl: encodeURIComponent(callbackUrl) if callbackUrl?
    callbackParams = $.param callbackUrl: callbackUrl if callbackUrl?

    encodedLoginParams = $.param callback: "#{protocol}://#{host}:#{port}/api/session?#{encodedCallbackParams}"
    loginParams = $.param callback: "#{protocol}://#{host}:#{port}/api/session?#{callbackParams}"

    @emailPasswordLoginUri = AUTHENTICATOR_URIS.EMAIL_PASSWORD + '?' + encodedLoginParams
    @citrixLoginUri        = AUTHENTICATOR_URIS.CITRIX + '?' + loginParams
    @facebookLoginUri      = AUTHENTICATOR_URIS.FACEBOOK + '?' + loginParams
    @githubLoginUri        = AUTHENTICATOR_URIS.GITHUB + '?' + loginParams
    @googleLoginUri        = AUTHENTICATOR_URIS.GOOGLE + '?' + loginParams
    @twitterLoginUri       = AUTHENTICATOR_URIS.TWITTER + '?' + loginParams
    @signUpUri             = AUTHENTICATOR_URIS.EMAIL_PASSWORD + '/signup?' + loginParams


angular.module('octobluApp').controller 'LoginController', LoginController
