class WorkspaceCloudController
  constructor: ($scope, $window, $cookies, $rootScope, $state, $stateParams, loadCWCNavBar, CWC_APP_STORE_URL, CWC_STAGING_URL, CWCAuthProxyService, AuthService) ->
    @state             = $state
    @referrer          = $window.document.referrer || 'https://citrix.cloud.com/'
    @stateParams       = $stateParams
    @CWC_APP_STORE_URL = CWC_APP_STORE_URL
    @CWC_STAGING_URL   = CWC_STAGING_URL
    {customerId, otp} = @stateParams
    CWCAuthProxyService.authenticateCWCUser(otp, customerId, @referrer)
      .then (results) =>
        sessionId = _.get results, 'cwc.sessionId'
        $cookies.meshblu_auth_uuid = results.userDevice.uuid
        $cookies.meshblu_auth_token = results.userDevice.token
        localStorage.setItem('workspaceCloudSessionId', sessionId)
        localStorage.setItem('workspaceCloudCustomerId', customerId)

        window.addEventListener 'message', (event) =>
          return unless event.origin == location.origin && event.data?.name == '$cwcNavbarUserAuthorized'
          window.location = "#{@CWC_APP_STORE_URL}?customerId=#{customerId}&sessionId=#{sessionId}"

        loadCWCNavBar({ AuthService, $state })

angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
