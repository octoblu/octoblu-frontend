class CWCLandingController
  constructor: ($scope, $window, CWCAccountService) ->
    @window = $window
    console.log("Window injected", @window)
    @CWCAccountService = CWCAccountService
    @scope = $scope

  requestAccess:()=>
    cwsToken = @window.localStorage.getItem("cwsToken")
    customer = @window.localStorage.getItem("customer")
    @CWCAccountService.validateToken(cwsToken, customer).then (isTokenValid) ->
      @scope.errorMessage = "There was a problem validating your CWC Account, please contact CWC Customer Support"





angular.module('octobluApp').controller 'CWCLandingController', CWCLandingController
