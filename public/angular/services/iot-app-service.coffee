class IotAppService
  constructor: ($http, $cookies, FLOW_DEPLOY_SERVICE_URL) ->
    @http = $http
    @FLOW_DEPLOY_SERVICE_URL = FLOW_DEPLOY_SERVICE_URL
    @cookies = $cookies

  publish: ({appId, flowId}) =>
    console.log "I was going to publish the bluprint", {appId, flowId}, @cookies
    @http(
      method: 'POST',
      headers:
        meshblu_auth_uuid: @cookies.meshblu_auth_uuid
        meshblu_auth_token: @cookies.meshblu_auth_token
      url: "#{@FLOW_DEPLOY_SERVICE_URL}/bluprint/#{appId}"
      data:
        flowId: flowId
    )

angular.module('octobluApp').service 'IotAppService', IotAppService
