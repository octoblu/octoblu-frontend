class CWCLandingController
  constructor: ($scope, $window, CWCAccountService) ->
    @window = $window
    @CWCAccountService = CWCAccountService
    @scope = $scope

  requestAccess:() =>
    cwsToken = @window.localStorage.getItem("cwsToken")
    customer = @window.localStorage.getItem("customer")
    console.log "CWCAccountService", @CWCAccountService
    @CWCAccountService.validateToken(cwsToken, customer)
      .then (isTokenValid) =>
        console.log "Validate token result: #{isTokenValid}"
        return @scope.errorMessage = "There was a problem validating your CWC Account, please contact CWC Customer Support" unless isTokenValid
        @CWCAccountService.createOctobluSession cwsToken







angular.module('octobluApp').controller 'CWCLandingController', CWCLandingController
