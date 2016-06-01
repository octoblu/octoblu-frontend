class PermissionV2Controller
  constructor: ($scope, ThingService) ->
    @ThingService = ThingService
    {@type, @addPermission, list} = $scope

    $scope.$watch 'list', =>
      @list = _.reject $scope.list, uuid: '*'
      $scope.everyone = _.some $scope.list, uuid: '*'
      delete @newDevice
      delete @newDeviceSearch

    $scope.$watch 'everyone', (newEveryone, oldEveryone) =>
      return if $scope.everyone == _.some $scope.list, uuid: '*'
      return $scope.addPermission @type, uuid: '*' if newEveryone
      $scope.removePermission @type, uuid: '*'


  searchForDevice: (deviceSearch) =>
    @ThingService.getThings(
      {$or: [ {uuid: deviceSearch}, {name: deviceSearch} ]}
      {name: true, uuid: true, type: true, logo: true}
    )

  addDevice: (device) =>
    return unless device?
    @addPermission @type, device


angular.module('octobluApp').controller 'PermissionV2Controller', PermissionV2Controller
