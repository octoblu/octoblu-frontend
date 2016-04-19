class ProfileService
  constructor: (MeshbluHttpService, $cookies, $q) ->
    @MeshbluHttpService = MeshbluHttpService
    @cookies       = $cookies
    @q             = $q

  update: (firstName, lastName, email, optInEmail) =>
    deferred = @q.defer()

    query =
      uuid: @cookies.meshblu_auth_uuid

    data =
      octoblu:
        firstName: firstName
        lastName: lastName
        email: email
        optInEmail: optInEmail?
        termsAcceptedAt: new Date()

    @MeshbluHttpService.update query, data, (error) =>
      return deferred.reject(error) if error?
      deferred.resolve()

    deferred.promise

  generateSessionToken: =>
    deferred = @q.defer()

    @MeshbluHttpService.generateAndStoreToken @cookies.meshblu_auth_uuid, name: 'app.octoblu.com', (error, data) =>
      return deferred.reject(error) if error?
      deferred.resolve data

    deferred.promise

angular.module('octobluApp').service 'ProfileService', ProfileService
