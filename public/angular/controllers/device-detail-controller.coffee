
class DeviceDetailController
  constructor: ($mdDialog, $scope, $state, $stateParams, deviceService, NotifyService, ThingService) ->
    @mdDialog = $mdDialog
    @scope = $scope
    @NotifyService = NotifyService
    @ThingService = ThingService
    @form = ['*']

    deviceService.getDeviceByUUID($stateParams.uuid).then (device) =>
      @device = device
      @readOnlyName = @deviceIsFlow()
      @hideDelete = @deviceIsFlow()
      @options = @device.options
      @optionsSchema = @device.optionsSchema

    @ThingService.getThings().then (devices) =>
      @devices = devices

    @scope.$watch 'controller.device',  @updateSchemas, true
    @scope.$watch 'controller.device.name', @saveDevice
    @scope.$watch 'controller.options',  @saveDevice, true

    @scope.$watch 'controller.devices', @updatePermissionRows, true
    @scope.$watch 'controller.device', @updateRows, true

    @scope.$watch 'controller.permissionRows', @updateDeviceWithPermissions, true

    @notifyDeviceUpdated = _.debounce @notifyDeviceUpdatedImmediate, 1000

  deviceIsFlow: =>
    @device.type == 'octoblu:flow' || @device.type == 'device:flow'

  confirmDeleteDevice: =>
    confirmOptions = {
      title: 'Are You Sure?'
      content: 'This action cannot be undone'
      ok: 'Delete'
      cancel: 'Cancel'
    }
    @mdDialog.show(@mdDialog.confirm(confirmOptions))
      .then =>
        @ThingService.deleteThing(@device)
      .then =>
        @state.go "material.configure"

  generateSessionToken: =>
    @ThingService.generateSessionToken(@device).then (token) =>
      alertOptions = {
        title: 'New Session Token'
        content: token
        ok: 'Dismiss'
      }

      @mdDialog.show @mdDialog.alert(alertOptions).clickOutsideToClose(false)

  saveDevice: =>
    return unless @device?
    @device.options = @options
    @ThingService.updateDevice _.pick(@device, 'uuid', 'name', 'options')
    .then =>
      @notifyDeviceUpdated()

  notifyDeviceUpdatedImmediate: =>
    @NotifyService.notify 'Changes Saved'

  updateDeviceWithPermissions: =>
    @ThingService.updateDeviceWithPermissionRows(@device, @permissionRows).then @notifyDeviceUpdated

  updatePermissionRows: =>
    @permissionRows = @ThingService.combineDeviceWithPeers @device, @devices

  updateSchemas: =>
    return unless @device?
    _.extend @options, @device.options
    _.extend @optionsSchema, @device.optionsSchema

angular.module 'octobluApp'
       .controller 'DeviceDetailController', DeviceDetailController
