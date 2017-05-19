class WorkspaceCloudController
  constructor: ($scope, $window, $cookies, $rootScope, $state, $stateParams, loadCWCNavBar, CWC_APP_STORE_URL, CWC_STAGING_URL, CWCAuthProxyService) ->
    @state             = $state
    @referrer          = $window.document.referrer || 'https://citrix.cloud.com/'
    @stateParams       = $stateParams
    @CWC_APP_STORE_URL = CWC_APP_STORE_URL
    @CWC_STAGING_URL   = CWC_STAGING_URL
    {customerId, otp} = @stateParams
    CWCAuthProxyService.authenticateCWCUser(otp, customerId, @referrer)
      .then (results) =>
        sessionId = _.get results, 'cwc.sessionId'
        loadCWCNavBar {sessionId, customerId, @referrer, hostname: 'cloud.com'}

    window.addEventListener 'message', (event) =>      
      return unless event.origin == location.origin && event.data?.name == '$cwcNavbarUserAuthorized'
      $cookies.workspaceCloud = true
      localStorage.setItem('workspaceCloud', true)
      $state.go 'login', @buildQueryParams()

  buildQueryParams: =>
    {customerId, otp} = @stateParams

    queryParams                   = {}
    queryParams["customerId"]     = customerId if customerId?
    queryParams["otp"]            = otp if otp?
    queryParams["cwcReferralUrl"] = @referrer
    queryParams["redirectUrl"]    = @CWC_APP_STORE_URL
    return queryParams

angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
