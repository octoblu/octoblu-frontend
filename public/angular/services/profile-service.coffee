class ProfileService
  constructor: (skynetService, $cookies, $q) ->
    @skynetPromise = skynetService.getSkynetConnection()
    @cookies       = $cookies
    @q             = $q

  update: (firstName, lastName, email, optInEmail) =>
    deferred = @q.defer()
    @skynetPromise
      .then (connection) =>
        query =
          uuid: @cookies.meshblu_auth_uuid
          octoblu:
            firstName: firstName
            lastName: lastName
            email: email
            optInEmail: optInEmail
            termsAcceptedAt: new Date()

        connection.update query, =>
          deferred.resolve()
      .catch deferred.reject

    deferred.promise

angular.module('octobluApp').service 'ProfileService', ProfileService


