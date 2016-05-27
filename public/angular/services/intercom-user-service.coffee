class IntercomUserService
  constructor: ($cookies, IntercomService, $q, $http, MeshbluHttpService, OCTOBLU_API_URL) ->
    @IntercomService = IntercomService
    @q = $q
    @http = $http
    @uuid = $cookies.meshblu_auth_uuid
    @OCTOBLU_API_URL = OCTOBLU_API_URL
    @MeshbluHttpService = MeshbluHttpService
    @userDevice = null
    @user_hash = null

  getUserDevice: =>
    deferred = @q.defer()
    return deferred.resolve() if @userDevice?
    @MeshbluHttpService.device @uuid, (error, userDevice) =>
      return deferred.reject(error) if error?
      return deferred.reject new Error('Missing Profile') unless userDevice.octoblu?
      @userDevice = userDevice
      deferred.resolve()
    return deferred.promise

  getUserHash: =>
    deferred = @q.defer()
    return deferred.resolve() if @user_hash?
    @http.get(@OCTOBLU_API_URL + '/api/intercom/user_hash')
      .then (response) =>
        if response?.status != 200
          return deferred.reject(response.data)
        @user_hash = response.data.user_hash
        deferred.resolve()
      .catch deferred.reject
    return deferred.promise

  updateIntercom: =>
    deferred = @q.defer()
    @getUserDevice()
      .catch (error) =>
        deferred.reject error
      .then =>
        return @getUserHash()
      .catch (error) =>
        deferred.reject error
      .then =>
        @setupIntercom()
    return deferred.promise

  setupIntercom: =>
    {
      email,
      firstName,
      lastName,
      optInEmail,
      termsAcceptedAt
    } = @userDevice.octoblu

    userInfo = {
      email,
      name: "#{firstName} #{lastName}"
      created_at: termsAcceptedAt
      user_id: @userDevice.uuid
      @user_hash,
      unsubscribed_from_emails: !optInEmail
    }

    @IntercomService.boot userInfo
    @IntercomService.update userInfo

angular.module('octobluApp').service 'IntercomUserService', IntercomUserService
