class ProfileService
  constructor: (skynetService, $cookies, $state) ->
    @skynetPromise = skynetService.getSkynetConnection()
    @cookies       = $cookies
    @state         = $state

  update: (firstName, lastName, email, optInEmail) =>
    @skynetPromise.then (connection) =>
      query =
        uuid: @cookies.meshblu_auth_uuid
        octoblu:
          firstName: firstName
          lastName: lastName
          email: email
          optInEmail: optInEmail
          termsAcceptedAt: new Date()

      connection.update query, =>
        @state.go 'material.home'

angular.module('octobluApp').service 'ProfileService', ProfileService


