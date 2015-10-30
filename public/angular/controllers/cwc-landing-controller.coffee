class CWCLandingController
  constructor: ($scope, $window, CWCAccountService) ->
    @scope              = $scope
    @window             = $window
    @CWCAccountService  = CWCAccountService
    @CWCValidationError = "There was a problem validating your CWC Account, please contact CWC Customer Support"

  requestAccess:() =>
    cwsToken = @window.localStorage.getItem("cwsToken")
    customer = @window.localStorage.getItem("customer")
    @CWCAccountService.validateToken(cwsToken, customer)
      .then (isTokenValid) =>
        return @scope.errorMessage = @CWCValidationError unless isTokenValid
        @CWCAccountService.createOctobluSession cwsToken
        .then (response) =>
          return unless response.data.callbackUrl?
          @window.location.href = response.data.callbackUrl


angular.module('octobluApp').controller 'CWCLandingController', CWCLandingController
