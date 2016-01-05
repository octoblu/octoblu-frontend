class LinkSubdeviceController
  constructor: ($scope, $state, $stateParams, ThingService) ->
    
    ThingService.getThing(uuid: $stateParams.deviceUuid).then (device) =>
      $scope.subdeviceLink = device: _.cloneDeep device
      {@device} = $scope.subdeviceLink
      $state.go 'material.nodewizard-linksubdevice.selecttype', {}, location: true

angular.module('octobluApp').controller 'LinkSubdeviceController', LinkSubdeviceController
