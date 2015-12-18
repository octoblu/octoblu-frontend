class LinkSubdeviceSelectController
  constructor: ($scope, $state, $stateParams, ThingService, deviceService) ->
    @scope = $scope
    @state = $state
    @deviceService = deviceService
    @ThingService = ThingService

    @ThingService.getThing(uuid: $stateParams.uuid).then (@device) =>

    @deviceService.getOnlineGateblus().then (@gateblus) =>

angular.module('octobluApp').controller 'LinkSubdeviceSelectController', LinkSubdeviceSelectController
