angular.module("octobluApp").controller("MaterialController", function($scope, $state, AuthService, loadCWCNavBar, CWC_DOMAIN) {
  "use strict"
  loadCWCNavBar({ AuthService: AuthService, $state: $state, CWC_DOMAIN: CWC_DOMAIN })
})
