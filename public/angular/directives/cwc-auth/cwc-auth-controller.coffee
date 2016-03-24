class CWCAuthController
  constructor: ($rootScope, $scope, $window, $state, $stateParams,  CWC_APP_STORE_URL, CWCAuthProxyService) ->
    @scope                 = $scope
    @rootScope             = $rootScope
    @window                = $window
    # @CWCAccountService     = CWCAccountService
    @state                 = $stateParams
    @stateParams           = $stateParams
    @loggingIn             = true
    @CWCValidationError    = "There was a problem validating your CWC Account, please contact CWC Customer Support"
    @CWCAuthenticatorError = "There was a problem authenticating your CWC Account with Octoblu"
    @CWCAuthProxyService   = CWCAuthProxyService
    @CWC_APP_STORE_URL     = CWC_APP_STORE_URL

    @requestAccess()

  requestAccess:() =>
    console.log 'stateParams', @stateParams
    {@customerId, @otp, @cwcReferralUrl} = @stateParams

    @CWCAuthProxyService
      .authenticateCWCUser(@otp, @customerId, @cwcReferralUrl)
      .then ( cwcAuthInfo ) =>
        return @scope.errorMessage = @CWCValidationError unless cwcAuthInfo?.cwcSessionId
        {@cwcSessionId, @cwcUserDevice} = cwcAuthInfo
        return @CWCAuthProxyService.createOctobluSession @cwcUserDevice.uuid, @cwcUserDevice.token, @CWC_APP_STORE_URL







angular.module('octobluApp').controller 'CWCAuthController', CWCAuthController
