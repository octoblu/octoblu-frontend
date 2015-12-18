class LinkSubdeviceController
  constructor: ($scope, $state, $stateParams, ThingService) ->
    @scope = $scope
    @state = $state
    @ThingService = ThingService

    @ThingService.getThing(uuid: $stateParams.uuid).then (device) =>
      @device = device
      @state.go 'material.nodewizard-linksubdevice.selectgateblu', {}, location: true

angular.module('octobluApp').controller 'LinkSubdeviceController', LinkSubdeviceController
