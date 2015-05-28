class IntercomUserService
  constructor: (skynetService, $intercom, $q) ->
    @skynetPromise = skynetService.getSkynetConnection()
    @intercom = $intercom
    @q = $q

  updateIntercom: =>
    deferred = @q.defer()
    @skynetPromise
      .then (connection) =>
        connection.whoami {}, (userDevice) =>
          return deferred.reject new Error('Missing Profile') unless userDevice.octoblu?
          @setupIntercom userDevice
          deferred.resolve()
      .catch (error) =>
        deferred.reject(new Error('meshblu connection error'))
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
