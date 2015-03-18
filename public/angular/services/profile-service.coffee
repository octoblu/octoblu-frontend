class ProfileService
  constructor: (skynetService, $cookies, $state) ->
    @skynetPromise = skynetService.getSkynetConnection()
    @cookies       = $cookies
    @state         = $state

  update: (firstName, lastName, email, optInEmail) =>
    agreeTermsOfService = new Date()

    @skynetPromise.then (connection) =>
      query =
        uuid: @cookies.meshblu_auth_uuid
        octoblu:
          firstName: firstName
          lastName: lastName
          email: email
          optInEmail: optInEmail
          agreeTermsOfService: agreeTermsOfService

      connection.update query, =>
        @state.go 'material.home'

angular.module('octobluApp').service 'ProfileService', ProfileService


