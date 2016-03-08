class WorkspaceCloudController
  constructor: ($scope, $cookies, $rootScope, $state, $stateParams, CWC_APP_STORE_URL, CWC_STAGING_URL) ->
    @stateParams       = $stateParams
    @CWC_APP_STORE_URL = CWC_APP_STORE_URL
    @CWC_STAGING_URL   = CWC_STAGING_URL

    $cookies.workspaceCloud = true

    $rootScope.$on "$cwcUserAuthorized", (event, data) =>
      $state.go 'login', @buildQueryParams()

  buildQueryParams: =>
    {customerId, otp} = @stateParams

    queryParams                   = {}
    queryParams["customerId"]     = customerId if customerId?
    queryParams["otp"]            = otp if otp?
    queryParams["cwcReferralUrl"] = @CWC_STAGING_URL
    queryParams["redirectUrl"]    = @CWC_APP_STORE_URL

    console.log 'queryParams', queryParams
    return queryParams


angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
