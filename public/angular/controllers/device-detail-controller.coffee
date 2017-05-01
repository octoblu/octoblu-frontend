{_, angular} = window

class DeviceDetailController
  constructor: ($q, $mdDialog, $scope, $state, $stateParams, meshbluConfig, MESHBLU_HOST, NotifyService, MeshbluJsonSchemaResolverService, ThingService, DeviceLogo) ->
    @mdDialog = $mdDialog
    @scope = $scope
    @state = $state
    @NotifyService = NotifyService
    @ThingService = ThingService
    @DeviceLogo = DeviceLogo
    @form = ['*']
    @showLink = false
    @loading = true
    @q = $q
    @stateParams = $stateParams
    @MESHBLU_DOMAIN = MESHBLU_HOST.replace /^\w+-?\w+\./, ''
    @meshbluConfig = meshbluConfig
    @meshbluJsonSchemaResolverService = new MeshbluJsonSchemaResolverService {meshbluConfig}
    @notifyDeviceUpdated = _.debounce @notifyDeviceUpdatedImmediate, 1000

    @getThing().then =>
      @loading = false

  getThing: =>
    @ThingService.getThing(uuid: @stateParams.uuid).then (@device) =>
      @device.options ?= {}
      @device.type ?= 'device:other'
      @device.logo = @logoUrl @device
      @deviceCopy = _.cloneDeep @device
      @readOnlyName = @deviceIsFlow @device
      @hideDelete = @deviceIsFlow @device
      @showLink = @deviceIsGatebluDevice @device
      @fragments = @generateBreadcrumbFragments @device
      @meshbluJsonSchemaResolverService
        .resolve _.get(@device, 'schemas', {})
        .then (resolvedSchemas) =>
          @resolvedDevice = _.cloneDeep @device
          @resolvedDevice.schemas = resolvedSchemas
      return

  getPermissions: =>
    return if @devices?
    @permissionsLoading = true
    projection =
      uuid: true
      type: true
      name: true
      logo: true
      logoUri: true
      meshblu: true
      configureWhitelist: true
      discoverWhitelist: true
      sendWhitelist: true
      receiveWhitelist: true
      connectorMetadata: true

    @ThingService.getThings(null, projection).then (@devices) =>
      @scope.$watch 'controller.permissionRows', @updateDeviceWithPermissions, true
      @updatePermissionRows()
    .then =>
      @permissionsLoading = false

  deviceIsFlow: (device) =>
    device.type == 'octoblu:flow' || device.type == 'device:flow'

  deviceIsGatebluDevice: (device) =>
    !@deviceIsFlow device

  generateBreadcrumbFragments: (device) =>
    return [{linkTo: 'material.things.my', label: 'My Things'},
      {label: "Manage #{device.name || device.uuid}"}]

  linkToGateblu: =>
    @state.go "material.nodewizard-linksubdevice", deviceUuid: @device.uuid, {location: true}

  logoUrl: (device) =>
    new @DeviceLogo(device).get()

  confirmSchemaChange: (callback) =>
    confirmOptions = {
      title: 'Are You Sure?'
      content: 'This will overwrite your data with the schema defaults.'
      ok: 'Confirm'
      cancel: 'Cancel'
    }
    @mdDialog.show(@mdDialog.confirm(confirmOptions))
      .then =>
        callback(true)
      .catch =>
        callback(false)

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
        name = @device.name || @device.type
        @state.go "material.things.my", deleted: name

  generateSessionToken: =>
    @ThingService.generateSessionToken(@device).then (session) =>
      {token} = session
      alertOptions = {
        title: 'New Session Token'
        content: token
        ok: 'Dismiss'
      }

      @mdDialog.show @mdDialog.alert(alertOptions).clickOutsideToClose(false)

  generateMeshbluJson: =>
    @ThingService.generateSessionToken(@device).then ({token}) =>
      meshbluJson =
        uuid: @device.uuid
        token: token
        domain: @MESHBLU_DOMAIN
        resolveSrv: true
      @meshbluJsonDataUri = "data:text/json;charset=utf-8,#{encodeURIComponent(JSON.stringify(meshbluJson, null, 2))}"

  saveDevice: =>
    return unless @device?
    return if _.isEqual @deviceCopy, @device
    omitFields = [
      'meshblu'
      'schemas'
      'online'
      'connectorMetadata'
      'discoverWhitelist'
      'discoverAsWhitelist'
      'configureWhitelist'
      'configureAsWhitelist'
      'receiveWhitelist'
      'receiveAsWhitelist'
      'sendWhitelist'
      'sendAsWhitelist'
    ]
    updateProperties = _.omit @device, omitFields
    updateProperties['schemas.selected.configure'] = _.get @device, 'schemas.selected.configure'
    @ThingService.updateDevice updateProperties
      .then =>
        @notifyDeviceUpdated()
        @deviceCopy = _.cloneDeep @device

  notifyDeviceUpdatedImmediate: =>
    @NotifyService.notify 'Changes Saved'

  updateDeviceWithPermissions: =>
    @ThingService.updateDeviceWithPermissionRows(@device, @permissionRows)
      .then (updated) =>
        @notifyDeviceUpdated() if updated

  updatePermissionRows: =>
    things = @ThingService.combineDeviceWithPeers @device, @devices
    @permissionRows = _.groupBy things, (thing) =>
      return "Octoblu" if thing.type == 'octoblu:user'
      return "other" unless thing.type?
      thing.type.slice(thing.type.indexOf(":")+1)

  updateSchemas: =>
    return unless @device?

angular.module('octobluApp').controller 'DeviceDetailController', DeviceDetailController
