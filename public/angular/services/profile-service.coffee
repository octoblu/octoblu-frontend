class ProfileService
  constructor: (MeshbluHttpService, $cookies, $q) ->
    @MeshbluHttpService = MeshbluHttpService
    @cookies       = $cookies
    @q             = $q

  update: (firstName, lastName, email, optInEmail) =>
    deferred = @q.defer()

    data =
      octoblu:
        firstName: firstName
        lastName: lastName
        email: email
        optInEmail: optInEmail?
        termsAcceptedAt: new Date()

    @MeshbluHttpService.update @cookies.meshblu_auth_uuid, data, (error) =>
      return deferred.reject(error) if error?
      deferred.resolve()

    deferred.promise

  generateSessionToken: (metadata={})=>
    deferred = @q.defer()
    metadata.tag ?= 'app.octoblu.com'

    @MeshbluHttpService.generateAndStoreToken @cookies.meshblu_auth_uuid, metadata, (error, token) =>
      return deferred.reject(error) if error?
      deferred.resolve {uuid: @cookies.meshblu_auth_uuid, token}

    deferred.promise

angular.module('octobluApp').service 'ProfileService', ProfileService
