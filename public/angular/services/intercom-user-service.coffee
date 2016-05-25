class IntercomUserService
  constructor: ($cookies, IntercomService, $q, MeshbluHttpService) ->
    @cookies = $cookies
    @IntercomService = IntercomService
    @q = $q
    @MeshbluHttpService = MeshbluHttpService

  updateIntercom: =>
    deferred = @q.defer()
    @MeshbluHttpService.device @cookies.meshblu_auth_uuid, (error, userDevice) =>
      return deferred.reject(error) if error?
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
      unsubscribed_from_emails: !userDevice.octoblu.optInEmail

    @IntercomService.boot userInfo
    @IntercomService.update userInfo

angular.module('octobluApp').service 'IntercomUserService', IntercomUserService
