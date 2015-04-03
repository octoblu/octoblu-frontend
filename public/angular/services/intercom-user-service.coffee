class IntercomUserService
  constructor: (skynetService, $intercom, $q) ->
    @skynetPromise = skynetService.getSkynetConnection()
    @intercom = $intercom
    @q = $q

  updateIntercom: =>
    @skynetPromise.then (connection) =>
      deferred = @q.defer()

      connection.whoami {}, (userDevice) =>
        return deferred.reject new Error('Missing Profile') unless userDevice.octoblu?
        @setupIntercom userDevice
        deferred.resolve()

      return deferred.promise

  setupIntercom: (userDevice) =>
    userInfo =
      email: userDevice.octoblu.email
      name: "#{userDevice.octoblu.firstName} #{userDevice.octoblu.lastName}"
      created_at: userDevice.octoblu.termsAcceptedAt
      user_id: userDevice.uuid

    @intercom.boot userInfo
    @intercom.update userInfo


angular.module('octobluApp').service 'IntercomUserService', IntercomUserService


