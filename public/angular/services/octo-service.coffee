class OctoService
  constructor: (OCTO_MASTER_UUID, $q, $cookies, skynetService, deviceService) ->
    @OCTO_MASTER_UUID = OCTO_MASTER_UUID
    @cookies = $cookies
    @q = $q
    @skynetService = skynetService
    @deviceService = deviceService

  list: =>
    @q.when []
    # @q.reject(new Error('Octo limit reached.'))

  add: =>
    userUuid = @cookies.meshblu_auth_uuid
    deviceProperties =
      type: 'octoblu:octo'
      discoverWhitelist: [userUuid]
      configureWhitelist: [userUuid]
      receiveWhitelist: ['*']
      sendWhitelist: [userUuid]

    @deviceService
      .registerDevice(deviceProperties)
      .then (newDevice) =>
        messagePayload =
          uuid: newDevice.uuid
          token: newDevice.token
        @sendCommand('add-octo', messagePayload)

  remove: (octo) =>
    @deviceService
      .resetToken(octo.uuid)
      .then =>
        @sendCommand('remove-octo', uuid : octo.uuid)

  sendCommand: (command, payload={}) =>
    deviceMessage =
      devices: @OCTO_MASTER_UUID
      topic: command
      payload: payload

    @skynetService.sendMessage deviceMessage


angular.module('octobluApp').service 'OctoService', OctoService
