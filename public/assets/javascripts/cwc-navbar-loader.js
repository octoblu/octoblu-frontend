function loadCWCNavBar(options) {
  if (!isInCWCMode()) return
  AuthService = options.AuthService
  $state = options.$state
  window.cwcSessionId = localStorage.getItem("workspaceCloudSessionId")
  window.cwcCustomerId = localStorage.getItem("workspaceCloudCustomerId")

  var body = $("body")
  var navbarElement = $("<cwc-navbar></cwc-navbar>")
  var navbarScriptElement = $("<script></script>")

  navbarElement.attr("service", "Octoblu" )
  navbarElement.attr("domain", "https://citrix.cloud.com")
  navbarElement.attr("logoff-event", "$octobluUserLoggedOff")
  navbarScriptElement.attr("src", "https://citrix.cloud.com/navbar/scripts/cwc-navbar.min.js")
  navbarScriptElement.attr("id", "cwc-navbar-source")
  body.append(navbarScriptElement)
  navbarElement.prependTo(body)

  window.addEventListener('message', function(event) {
    if (event.origin === location.origin && event.data && event.data.name === '$cwcNavbarUserLoggedOff') {
      AuthService.logout().then(function() {
        window.postMessage({name: '$octobluUserLoggedOff'}, '*')
      })
    }
    if (event.origin === location.origin && event.data && event.data.name === '$cwcNavbarUserNotAuthorized') {
      AuthService.logout()
    }
  })
}

function isInCWCMode() {
  return localStorage.getItem("workspaceCloudCustomerId") && localStorage.getItem("workspaceCloudSessionId")
}
