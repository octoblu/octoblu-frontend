class PermissionsV2Controller
  constructor: ($scope, $stateParams, ThingService, NotifyService) ->
    {@thing} = $scope
    console.log {@thing}
    @ThingService = ThingService
    @NotifyService = NotifyService
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
    path = "meshblu.whitelists.#{permission}"
    _.set(@thing, path, []) unless _.get(@thing, path)?
    return _.get(@thing, path)

  removePermission: (permission, {uuid}) =>
    @ThingService.updateDangerously(@thing.uuid, $pull: "meshblu.whitelists.#{permission}": {uuid})
      .catch (error) => @NotifyService.notify 'Could not edit device'
      .then => @ThingService.getThing @thing
      .then (@thing) =>



  addPermission: (permission, {uuid}) =>
    @ThingService.updateDangerously(@thing.uuid, $addToSet: "meshblu.whitelists.#{permission}": {uuid})
      .catch (error) => @NotifyService.notify 'Could not edit device'
      .then => @ThingService.getThing @thing
      .then (@thing) =>

angular.module('octobluApp').controller 'PermissionsV2Controller', PermissionsV2Controller
