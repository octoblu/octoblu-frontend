class LinkSubdeviceSelectGatebluController
  constructor: ($scope, $state, $stateParams, $cookies, ThingService, deviceService) ->
    @state = $state
    {@device} = $scope.subdeviceLink
    @subdeviceLink = $scope.subdeviceLink
    deviceService.getGateblus().then (@gateblus) =>

  selectGateblu: (gateblu) =>
    @subdeviceLink.gateblu = _.cloneDeep gateblu
    @state.go 'material.nodewizard-linksubdevice.form'

angular.module('octobluApp').controller 'LinkSubdeviceSelectGatebluController', LinkSubdeviceSelectGatebluController
