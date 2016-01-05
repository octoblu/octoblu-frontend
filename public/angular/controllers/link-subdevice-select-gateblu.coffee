class LinkSubdeviceSelectGatebluController
  constructor: ($scope, $state, $stateParams, $cookies, ThingService, deviceService) ->
    @state = $state
    {@device} = $scope.subdeviceLink
    @subdeviceLink = $scope.subdeviceLink
    deviceService.getGateblus().then (@gateblus) =>

  selectGateblu: (gateblu) =>
    @device.gateblu = gateblu.uuid
    @device.configureWhitelist = [gateblu.uuid]
    @device.discoverWhitelist = [gateblu.uuid]
    @device.sendAsWhitelist = [gateblu.uuid]
    @device.receiveAsWhitelist = [gateblu.uuid]
    @device.configureAsWhitelist = []
    @device.discoverAsWhitelist = []

    @subdeviceLink.gateblu = _.cloneDeep gateblu
    @state.go 'material.nodewizard-linksubdevice.form'

angular.module('octobluApp').controller 'LinkSubdeviceSelectGatebluController', LinkSubdeviceSelectGatebluController
