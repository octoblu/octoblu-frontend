class CredentialsDeviceController
  constructor: ($scope, $location, ThingService, MeshbluHttpService, MESHBLU_HOST, MESHBLU_PORT, NotifyService) ->
    @queryParams = $location.search()
    @NotifyService = NotifyService

    @meshbluHttp = MeshbluHttpService.create
      server: MESHBLU_HOST
      port: MESHBLU_PORT
      uuid: @queryParams.creds_uuid
      token: @queryParams.creds_token

    @meshbluHttp.whoami (error, @device) =>
      $scope.connectedDevices = _.map @device.sendWhitelist, (uuid) =>
        uuid: uuid
        enabled: true

    $scope.$watch 'connectedDevices', @watchWhitelist, true

  watchWhitelist: (newWhitelist, oldWhitelist) =>
    return unless newWhitelist? && oldWhitelist?
    return if _.isEqual newWhitelist, oldWhitelist

    @updateWhitelist newWhitelist

  updateWhitelist: (whitelist) =>
    return unless whitelist?

    enabledDevices = _.filter whitelist, {enabled: true}
    sendWhitelist = _.pluck enabledDevices, 'uuid'
    options =
      $set:
        sendWhitelist: sendWhitelist

    @meshbluHttp.updateDangerously @device.uuid, options, (error) =>
      return @NotifyService.notify error.message if error?

      @NotifyService.notify 'Device Updated'

angular.module('octobluApp').controller 'CredentialsDeviceController', CredentialsDeviceController
