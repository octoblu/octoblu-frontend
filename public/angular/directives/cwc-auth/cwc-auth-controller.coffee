class CWCAuthController
  constructor: ($rootScope, $scope, $window, CWCAccountService) ->
    @scope             = $scope
    @rootScope         = $rootScope
    @window            = $window
    @CWCAccountService = CWCAccountService

    @loggingIn             = true
    @CWCValidationError    = "There was a problem validating your CWC Account, please contact CWC Customer Support"
    @CWCAuthenticatorError = "There was a problem authenticating your CWC Account with Octoblu"

    @rootScope.$on "$cwcUserAuthorized", (event, data) =>
      @requestAccess()

  requestAccess:() =>
    cwsToken = @window.localStorage.getItem "cwsToken"
    cwcCustomer = @window.localStorage.getItem "customer"
  
    @CWCAccountService.validateToken(cwsToken, cwcCustomer)
      .then (isTokenValid) =>
        return @scope.errorMessage = @CWCValidationError unless isTokenValid
        @CWCAccountService.createOctobluSession cwsToken
        .then (response) =>
          @loggingIn = false

          return @scope.errorMessage = @CWCAuthenticatorError if !response.data?
          return unless response.data.callbackUrl?
          @window.location.href = response.data.callbackUrl


angular.module('octobluApp').controller 'CWCAuthController', CWCAuthController
