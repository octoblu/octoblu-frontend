angular.module("octobluApp").controller("MaterialController", function($scope, $state, AuthService, loadCWCNavBar) {
  "use strict"
  loadCWCNavBar({ AuthService: AuthService, $state: $state })
})
