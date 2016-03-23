$(document).ready(function() {
  if (!verifyWorkspaceCloudUser()) return

  var body                = $('body')
  var navbarElement       = $("<cwc-navbar></cwc-navbar>")
  var navbarScriptElement = $("<script></script>")
  var hostname            = getEnvironmentDomain(document.referrer)

  navbarElement.attr("domain", "https://workspace." + hostname )
  navbarElement.attr("logoff-event", "$octobluUserLoggedOff")
  navbarScriptElement.attr("src", "https://workspace." + hostname + "/navbar/scripts/cwc-navbar.min.js")
  navbarScriptElement.attr("id", "cwc-navbar-source")
  body.append(navbarScriptElement)
  navbarElement.prependTo(body)
})

function verifyWorkspaceCloudUser() {
  if (window.location.pathname === '/workspacecloud') return true
  if (window.localStorage.getItem('customer')) return true

  return false
}

function getEnvironmentDomain(referrer) {
  // Production Env
  if (referrer.indexOf('cloud.com') > -1) return 'cloud.com'
  // SI Env
  if (referrer.indexOf('tryworkspaces') > -1) return 'tryworkspaces.com'

  // Staging Env
  return 'cloudburrito.com'
}
