class CWCAuthController
  constructor: ($scope, $window, $cookies,  $stateParams,  CWC_APP_STORE_URL, CWCAuthProxyService) ->
    @scope                 = $scope
    @window                = $window
    @cookies               = $cookies
    @stateParams           = $stateParams
    @loggingIn             = true
    @CWCValidationError    = "There was a problem validating your CWC Account, please contact CWC Customer Support"
    # @CWCAuthenticatorError = "There was a problem authenticating your CWC Account with Octoblu"
    @CWCAuthProxyService   = CWCAuthProxyService
    @CWC_APP_STORE_URL     = CWC_APP_STORE_URL

    @requestAccess()

  requestAccess:() =>
    {customerId, otp, cwcReferralUrl} = @stateParams

    @CWCAuthProxyService
      .authenticateCWCUser(otp, customerId, cwcReferralUrl)
      .then ( cwcAuthInfo={} ) =>
        {cwc, userDevice} = cwcAuthInfo
        return @scope.errorMessage = @CWCValidationError unless cwc?
        # {@cwcSessionId, @cwcUserDevice} = cwcAuthInfo
        {sessionId} = cwc
        @cookies.cwcSessionId = sessionId
        @cookies.cwcCustomerId = customerId

        @window.cwcSessionId = sessionId
        @window.cwcCustomerId = customerId

        return @CWCAuthProxyService.createOctobluSession userDevice.uuid, userDevice.token, @CWC_APP_STORE_URL

angular.module('octobluApp').controller 'CWCAuthController', CWCAuthController
