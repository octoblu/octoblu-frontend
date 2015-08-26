class DeviceDetailController
  constructor: ($mdDialog, $scope, $state, $stateParams, NotifyService, ThingService) ->
    @mdDialog = $mdDialog
    @scope = $scope
    @state = $state
    @NotifyService = NotifyService
    @ThingService = ThingService
    @form = ['*']
    @firstRun = true

    @ThingService.getThing(uuid: $stateParams.uuid).then (device) =>
      @device = device
      @device.options ?= {}
      @deviceCopy = _.cloneDeep device
      @readOnlyName = @deviceIsFlow()
      @hideDelete = @deviceIsFlow()

    @ThingService.getThings().then (devices) =>
      @devices = devices
      @scope.$watch 'controller.devices', @updatePermissionRows, true
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
    return if _.isEqual @deviceCopy, @device
    @ThingService.updateDevice _.pick(@device, 'uuid', 'name', 'options')
    .then =>
      @notifyDeviceUpdated()
      @deviceCopy = _.cloneDeep @device

  notifyDeviceUpdatedImmediate: =>
    @NotifyService.notify 'Changes Saved'

  updateDeviceWithPermissions: =>
    @ThingService.updateDeviceWithPermissionRows(@device, @permissionRows)
      .then =>
        if @firstRun
          @firstRun = false
        else
          @notifyDeviceUpdated()

  updatePermissionRows: =>
    @permissionRows = @ThingService.combineDeviceWithPeers @device, @devices

  updateSchemas: =>
    return unless @device?

angular.module 'octobluApp'
       .controller 'DeviceDetailController', DeviceDetailController
