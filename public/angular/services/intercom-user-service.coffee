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
    @q (resolve, reject) =>
      return resolve() if @userDevice?
      @MeshbluHttpService.device @uuid, (error, userDevice) =>
        return reject(error) if error?
        return reject new Error('Missing Profile') unless userDevice.octoblu?
        @userDevice = userDevice
        resolve()

  getUserHash: =>
    @q (resolve, reject) =>
      return resolve() if @user_hash?
      @http.get(@OCTOBLU_API_URL + '/api/intercom/user_hash')
        .then (response) =>
          if response?.status != 200
            return reject(response.data)
          @user_hash = response.data.user_hash
          resolve()
        .catch reject

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
