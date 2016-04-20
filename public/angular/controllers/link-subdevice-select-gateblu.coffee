class LinkSubdeviceSelectGatebluController
  constructor: ($scope, $state, $stateParams, $cookies, ThingService) ->
    @state = $state
    {@device, @nodeType} = $scope.subdeviceLink
    @subdeviceLink = $scope.subdeviceLink
    ThingService.getThings(type: 'device:gateblu').then (@gateblus) =>

  selectGateblu: (gateblu) =>
    @subdeviceLink.gateblu = _.cloneDeep gateblu
    @state.go 'material.nodewizard-linksubdevice.form'

angular.module('octobluApp').controller 'LinkSubdeviceSelectGatebluController', LinkSubdeviceSelectGatebluController
