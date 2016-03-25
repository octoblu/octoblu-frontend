class CWCAuthProxyService
  constructor: ($rootScope, $http, OCTOBLU_API_URL, CWC_AUTHENTICATOR_PROXY_URL) ->
    @http            = $http
    @CWC_AUTHENTICATOR_PROXY_URL = CWC_AUTHENTICATOR_PROXY_URL
    @OCTOBLU_API_URL = OCTOBLU_API_URL

  authenticateCWCUser: (oneTimePassword, customerId, cwcRefererUrl) =>
    @http.post("#{@CWC_AUTHENTICATOR_PROXY_URL}/authenticate", {
      otp: oneTimePassword
      customerId: customerId
      cwcRefererUrl : cwcRefererUrl
    })
    .then (response) =>
      response.data

  createOctobluSession: (meshbluAuthUUID, meshbluAuthToken, redirectUrl) =>
    queryString = "uuid=#{meshbluAuthUUID}&token=#{meshbluAuthToken}&callbackUrl=#{encodeURIComponent(redirectUrl)}"
    @http.get "#{@OCTOBLU_API_URL}/api/session?#{queryString}"



angular.module('octobluApp').service 'CWCAuthProxyService', CWCAuthProxyService
