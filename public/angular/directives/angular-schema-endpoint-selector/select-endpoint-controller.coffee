class SelectEndpointController
  constructor: ($scope) ->
    @scope = $scope

    @scope.$watch 'model.endpoint', (endpoint) =>
      console.log 'endpoint', endpoint
      if endpoint?.value?
        [method, url] = endpoint.value.split /-(.*)/
        @scope.model.url = url
        @scope.model.method = method
        console.log @scope.model

angular.module('octobluApp').controller 'SelectEndpointController', SelectEndpointController
