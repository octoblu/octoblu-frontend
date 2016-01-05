class LinkSubdeviceSelectGatebluController
  constructor: ($scope, $state, $stateParams, $cookies, ThingService, deviceService) ->
    @state = $state
    {@device} = $scope.subdeviceLink
    @subdeviceLink = $scope.subdeviceLink
    deviceService.getGateblus().then (@gateblus) =>

  selectGateblu: (gateblu) =>
    @device.gateblu = gateblu.uuid
    @device.configureWhitelist = _.union [gateblu.uuid], @device.configureWhitelist
    @device.discoverWhitelist = _.union [gateblu.uuid], @device.discoverWhitelist
    @device.sendAsWhitelist = _.union [gateblu.uuid], @device.sendAsWhitelist
    @device.receiveAsWhitelist = _.union [gateblu.uuid], @device.receiveAsWhitelist

    @subdeviceLink.gateblu = _.cloneDeep gateblu
    @state.go 'material.nodewizard-linksubdevice.form'

angular.module('octobluApp').controller 'LinkSubdeviceSelectGatebluController', LinkSubdeviceSelectGatebluController
