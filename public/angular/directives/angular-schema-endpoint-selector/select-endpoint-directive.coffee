angular.module('schemaForm').directive 'selectEndpoint', ->
  restrict: 'E'
  replace: false
  transclude: false
  scope: true
  controller: SelectEndpointController
  templateUrl: '/angular/directives/angular-schema-endpoint-selector/select-endpoint.html'
