class ProfileService
  constructor: (MeshbluHttpService, $cookies, $q) ->
    @MeshbluHttpService = MeshbluHttpService
    @cookies       = $cookies
    @q             = $q

  updateNew: (firstName, lastName, email, optInEmail) =>
    deferred = @q.defer()

    query =
      'octoblu.firstName': firstName
      'octoblu.lastName': lastName
      'octoblu.email': email
      'octoblu.optInEmail': !!optInEmail
      'octoblu.termsAcceptedAt': new Date()

    @MeshbluHttpService.updateDangerously @cookies.meshblu_auth_uuid, { $set: query }, (error) =>
      return deferred.reject(error) if error?
      deferred.resolve()

    deferred.promise

  updateAfter: ({ firstName, lastName, email, optInEmail }) =>
    deferred = @q.defer()

    query =
      'octoblu.firstName': firstName
      'octoblu.lastName': lastName
      'octoblu.email': email
      'octoblu.optInEmail': !!optInEmail

    @MeshbluHttpService.updateDangerously @cookies.meshblu_auth_uuid, { $set: query }, (error) =>
      return deferred.reject(error) if error?
      deferred.resolve()

    deferred.promise

angular.module('octobluApp').service 'ProfileService', ProfileService
