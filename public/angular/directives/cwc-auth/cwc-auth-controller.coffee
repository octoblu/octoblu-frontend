class CWCAuthController
  constructor: ($scope, $window, $cookies,  $stateParams,  CWC_APP_STORE_URL, OCTOBLU_API_URL, CWCAuthProxyService) ->
    @scope                 = $scope
    @window                = $window
    @cookies               = $cookies
    @stateParams           = $stateParams
    @loggingIn             = true
    @CWCValidationError    = "There was a problem validating your CWC Account, please contact CWC Customer Support"
    @CWCAuthProxyService   = CWCAuthProxyService
    @CWC_APP_STORE_URL     = CWC_APP_STORE_URL
    @OCTOBLU_API_URL       = OCTOBLU_API_URL
    @requestAccess()

  requestAccess:() =>
    {customerId, otp, cwcReferralUrl} = @stateParams

    @CWCAuthProxyService
      .authenticateCWCUser(otp, customerId, cwcReferralUrl)
      .then ( cwcAuthInfo={} ) =>
        {cwc, userDevice} = cwcAuthInfo
        return @scope.errorMessage = @CWCValidationError unless cwc?        
        {sessionId} = cwc
        @cookies.cwcSessionId = sessionId
        @cookies.cwcCustomerId = customerId

        @window.cwcSessionId = sessionId
        @window.cwcCustomerId = customerId
        @window.location = @getSessionUrl userDevice.uuid, userDevice.token, @CWC_APP_STORE_URL

  getSessionUrl: (meshbluAuthUUID, meshbluAuthToken, redirectUrl) =>
    queryString = "uuid=#{meshbluAuthUUID}&token=#{meshbluAuthToken}&callbackUrl=#{encodeURIComponent(redirectUrl)}"
    return "#{@OCTOBLU_API_URL}/api/session?#{queryString}"


angular.module('octobluApp').controller 'CWCAuthController', CWCAuthController
