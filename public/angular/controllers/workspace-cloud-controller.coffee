class WorkspaceCloudController
  constructor: ($scope, $cookies, $state, $window) ->
    @cookies = $cookies
    @state   = $state
    @scope   = $scope

    { referrer } = $window.document

    console.log 'Referrer', referrer

    #Get the referrer Url from $window.document.referrer
    #CWCAuthProxyService.createOctobluSession(oneTimePassword, customerId, referrerUrl)
    #On Success - Call AuthenticateService to log the user Device in
    #On Error - Display Error Message on Workspace Cloud Page
    # $window.location = 'https://cwc-auth-proxy.octoblu.com'
    # @cookies.workspaceCloud = true
    # @state.go 'login'

angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
