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
    {@customerId, @otp, @cwcReferralUrl} = @stateParams

    @CWCAuthProxyService
      .authenticateCWCUser(@otp, @customerId, @cwcReferralUrl)
      .then ( cwcAuthInfo ) =>
        return @scope.errorMessage = @CWCValidationError unless cwcAuthInfo?.cwcSessionId?
        {@cwcSessionId, @cwcUserDevice} = cwcAuthInfo
        @cookies.cwcSessionId = @cwcSessionId
        @cookies.cwcCustomerId = @customerId

        @window.cwcSessionId = @cwcSessionId
        @window.cwcCustomerId = @customerId

        return @CWCAuthProxyService.createOctobluSession @cwcUserDevice.uuid, @cwcUserDevice.token, @CWC_APP_STORE_URL

angular.module('octobluApp').controller 'CWCAuthController', CWCAuthController
