$(document).ready(function() {
  if (!verifyWorkspaceCloudUser()
  || !referredFromCitrixCloudDomain(document.referrer)) return

  var body                = $('body')
  var navbarElement       = $("<cwc-navbar></cwc-navbar>")
  var navbarScriptElement = $("<script></script>")
  var hostname            = getEnvironmentDomain(document.referrer)

  navbarElement.attr("domain", "https://citrix." + hostname )
  navbarElement.attr("logoff-event", "$octobluUserLoggedOff")
  navbarScriptElement.attr("src", "https://citrix." + hostname + "/navbar/scripts/cwc-navbar.min.js")
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
  return 'cloud.com'

  // if (referrer.indexOf('cloudburrito.com') > -1) return 'cloudburrito.com'
  // if (referrer.indexOf('tryworkspaces') > -1) return 'tryworkspaces.com'
}
/**
TODO - Remove after Synergy. Checking if the referrer is from
*.cloudburrito.com, *.cloud.com, *.tryworkspaces.com
**/
function referredFromCitrixCloudDomain(referrer){
  if(!referrer)return false;
  if("*\.cloud\.com".test(referrer)){
    return true;
  } else if("*\.cloudburrito\.com".test(referrer)){
    return true;
  } else if("*\.tryworkspaces\.com".test(referrer)){
    return true;
  }
  return false;
}
