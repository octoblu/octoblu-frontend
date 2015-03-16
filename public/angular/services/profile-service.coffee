class ProfileService
  # @HOST: "https://email-password.octoblu.com"
  # @HOST: "http://localhost:3003"

  constructor: ($q, $http, PROFILE_URI) ->
    @q = $q
    @http = $http
    @PROFILE_URI = PROFILE_URI

  create: (firstName, lastName, email, optInEmail, agreeTermsOfService) =>
    @http
      .post "#{@PROFILE_URI}/", {
        firstName: firstName
        lastName: lastName
        email: email
        optInEmail: optInEmail
        agreeTermsOfService: agreeTermsOfService
      }
      .then (result) =>
        result.data
      .catch (result) =>
        @q.reject result.data


angular.module('octobluApp').service 'ProfileService', ProfileService


