class WorkspaceCloudController
  constructor: ($scope, $cookies, $rootScope, $state, $stateParams, $window, CWC_APP_STORE_URL, CWC_STAGING_URL) ->
    #Check the reffer Url, if it doesn't exist go directly to login
    #If referrer Url exists
    #  if referrer Url is from CWC (CloudBuritto, TryWorkspaces or Cloud) then
    #     set flag for workspaceCloudUser on the cookies
    #     route to login with the query parameters (otp, customerId, cwcReferralUrl, redirectUrl)
    #otherwise
    # redirect to login
    @state             = $state
    @referrer          = $window.document.referrer
    @stateParams       = $stateParams
    @CWC_APP_STORE_URL = CWC_APP_STORE_URL
    @CWC_STAGING_URL   = CWC_STAGING_URL

    return @state.go("login", {}) if _.isEmpty @referrer

    $rootScope.$on "$cwcUserAuthorized", (event, data) =>
      # $cookies.workspaceCloud = true
      localStorage.setItem('workspaceCloud', true);
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
