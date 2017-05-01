class PermissionsV2Controller
  constructor: ($scope, $stateParams, ThingService, NotifyService) ->
    {@thing} = $scope
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

    @loading = true
    @_getWhitelistedDevices().then => @loading = false
    {uuid} = $stateParams

  getPermissionList: (permission) =>
    return @permissionModels[permission]

  removePermission: (permission, {uuid}) =>
    @ThingService.updateDangerously(@thing.uuid, $pull: "meshblu.whitelists.#{permission}": {uuid})
      .catch (error) => @NotifyService.notify 'Could not edit device'
      .then => @ThingService.getThing @thing
      .then (@thing) => @_getWhitelistedDevices()

  addPermission: (permission, {uuid}) =>
    @ThingService.updateDangerously(@thing.uuid, $addToSet: "meshblu.whitelists.#{permission}": {uuid})
      .catch (error) => @NotifyService.notify 'Could not edit device'
      .then => @ThingService.getThing @thing
      .then (@thing) => @_getWhitelistedDevices()

  _getWhitelistedDevices: =>
    whitelistedDevices =
      _(@PERMISSION_TYPES)
        .map (permission) => _.map _.get(@thing, "meshblu.whitelists.#{permission}"), 'uuid'
        .flatten()
        .uniq()
        .without '*'
        .value()

    search =
      query:
        uuid: $in: whitelistedDevices
      projection: {
        meshblu: true
        logoUri: true
        name: true
        type: true
        uuid: true
        logo: true
        octoblu: true
      }

    @ThingService.search search
      .then @_buildPermissionsModel

  _buildPermissionsModel: (devices) =>
    @permissionModels = {}
    _.each @PERMISSION_TYPES, (permission) =>
      @permissionModels[permission] = @_buildPermissionModel permission, devices
      return true

  _buildPermissionModel: (permission, devices) =>
    list = _.get @thing, "meshblu.whitelists.#{permission}"
    return [] unless list?
    _.map list, (item) =>
      device = _.find devices, uuid: item.uuid
      return device if device?
      return item

angular.module('octobluApp').controller 'PermissionsV2Controller', PermissionsV2Controller
