class PermissionsV2Controller
  constructor: ($scope, $stateParams, ThingService) ->
    {@thing} = $scope
    console.log {@thing}
    @ThingService = ThingService
    @PERMISSION_TYPES = [
        'broadcast.as'
        'broadcast.received'
        'broadcast.sent'
        'discover.as'
        'discover.view'
        'configure.as'
        'configure.received'
        'configure.sent'
        'configure.update'
        'message.as'
        'message.from'
        'message.received'
        'message.sent'
    ]

    {uuid} = $stateParams

  getPermissionList: (permission) =>
    return _.get(@thing.meshblu?.whitelists, permission)

  removePermission: (permission, {uuid}) =>
    @ThingService.updateDangerously(@thing.uuid, $pull: "meshblu.whitelists.#{permission}": {uuid})
      .then => @ThingService.getThing @thing
      .then (@thing) =>


  addPermission: (permission, {uuid}) =>
    @ThingService.updateDangerously(@thing.uuid, $addToSet: "meshblu.whitelists.#{permission}": {uuid})
      .then => @ThingService.getThing @thing
      .then (@thing) =>

angular.module('octobluApp').controller 'PermissionsV2Controller', PermissionsV2Controller
