
class DeviceDetailController
  @TABS:
    properties: 0
    permissions: 1

  constructor: ($mdDialog, $scope, $state, $stateParams, deviceService, NotifyService, ThingService) ->
    @mdDialog = $mdDialog
    @scope = $scope
    @state = $state
    @activeTabIndex = DeviceDetailController.TABS[$stateParams.tab]
    @NotifyService = NotifyService
    @ThingService = ThingService
    @form = ['*']

    @saveDevice = _.throttle @saveDeviceNow, 100

    deviceService.getDeviceByUUID($stateParams.uuid).then (device) =>
      @device = device
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
        @state.go 'material.nodes'

  generateSessionToken: =>
    @ThingService.generateSessionToken(@device).then (token) =>
      alertOptions = {
        title: 'New Session Token'
        content: token
        ok: 'Dismiss'
      }

      @mdDialog.show @mdDialog.alert(alertOptions).clickOutsideToClose(false)

  onTabSelection: (tabName) =>
    return unless @device?
    @state.go 'material.deviceTab', {uuid: @device.uuid, tab: tabName}, notify: false

  saveDeviceNow: =>
    return unless @device?
    @device.options = @options
    @ThingService.updateDevice _.pick(@device, 'uuid', 'name', 'options')

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
