class SelectEndpointController
  constructor: ($scope) ->
    @scope = $scope

    @scope.$watch 'endpoint', (endpoint) =>
      console.log 'endpoint', endpoint

      [method, url] = endpoint.split /-(.*)/
      @scope.model.url = url
      @scope.model.method = method

angular.module('octobluApp').controller 'SelectEndpointController', SelectEndpointController
