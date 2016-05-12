class SelectEndpointController
  constructor: ($scope) ->
    @scope = $scope
    @scope.loading = true

    @scope.$watch 'model.endpoint', (endpoint) =>
      if endpoint?.value?
        [method, url] = endpoint.value.split /-(.*)/
        @scope.model.url = url
        @scope.model.method = method
      @scope.loading = false

angular.module('octobluApp').controller 'SelectEndpointController', SelectEndpointController
