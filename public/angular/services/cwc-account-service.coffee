class CWCAccountService
  constructor: ($cookies, $http, $q, $window, skynetService, CWC_TRUST_URL, OCTOBLU_API_URL, CWC_AUTHENTICATOR_URL) ->
    @cookies         = $cookies
    @http            = $http
    @q               = $q
    @window          = $window
    @skynetPromise   = skynetService.getSkynetConnection()
    @CWC_AUTHENTICATOR_URL = CWC_AUTHENTICATOR_URL
    @CWC_TRUST_URL   = CWC_TRUST_URL
    @OCTOBLU_API_URL = OCTOBLU_API_URL

    @setWorkspaceCloudUserProperty() if @cookies.workspaceCloud

  setWorkspaceCloudUserProperty: =>
    delete @cookies.workspaceCloud
    deferred = @q.defer()

    @skynetPromise
      .then (connection) =>
        query =
          uuid: @cookies.meshblu_auth_uuid
          workspaceCloudUser: true

        connection.update query, =>
          deferred.resolve()
      .catch deferred.reject

    deferred.promise

  createOctobluSession: (token) =>
    return unless token?
    url = "#{CWC_AUTHENTICATOR_URL}/devices"
    options =
       callbackUrl: "#{@OCTOBLU_API_URL}/api/session?callbackUrl=%2F"
       token: token
    @http.post url, options

  validateToken: (token, customer) =>
    url = "#{@CWC_TRUST_URL}/#{customer}/Tokens"

    options =
      headers:
        "Authorization": "CWSAuth bearer=#{token}"
      json: true

    @http.get(url, options).then ((response) => response.data), (error) => error.msg if error?


angular.module('octobluApp').service 'CWCAccountService', CWCAccountService
