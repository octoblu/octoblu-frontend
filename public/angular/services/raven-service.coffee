class RavenService
  constructor: ($q, $cookies, SENTRY_DSN, MeshbluHttpService) ->
    @MeshbluHttpService = MeshbluHttpService
    @uuid = $cookies.meshblu_auth_uuid
    @q = $q
    @dsn = SENTRY_DSN

  setup: =>
    return if Raven.isSetup()
    return unless @dsn
    Raven
      .config @dsn
      .addPlugin Raven.Plugins.Angular
      .install()

  getUserDevice: =>
    @q (resolve, reject) =>
      return resolve @userDevice if @userDevice?
      @MeshbluHttpService.device @uuid, (error, userDevice) =>
        return reject(error) if error?
        return reject new Error('Missing Profile') unless userDevice?.octoblu?
        resolve userDevice

  update: =>
    return @q.when() unless @dsn
    deferred = @q.defer()
    @setup()
    @getUserDevice()
      .catch (error) =>
        deferred.reject error
      .then (userDevice) =>
        { uuid, octoblu } = userDevice
        return deferred.resolve() if @userDevice? && @userDevice.uuid == uuid
        @userDevice = userDevice
        { email } = octoblu ? {}
        @setUser { uuid, email }
        deferred.resolve()
        return

    return deferred.promise

  setUser: ({ uuid, email })=>
    Raven.setUserContext({ uuid, email })

angular.module('octobluApp').service 'RavenService', RavenService
