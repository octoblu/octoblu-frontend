function loadCWCNavBar(options) {
  if(!isInCWCMode(document.referrer)) return
  window.cwcSessionId = options.sessionId;
  window.cwcCustomerId = options.customerId
  var hostname = options.hostname;

  var body                = $('body')
  var navbarElement       = $("<cwc-navbar></cwc-navbar>")
  var navbarScriptElement = $("<script></script>")

  navbarElement.attr("domain", "https://citrix." + hostname )
  navbarElement.attr("logoff-event", "$octobluUserLoggedOff")
  navbarScriptElement.attr("src", "https://citrix." + hostname + "/navbar/scripts/cwc-navbar.min.js")
  navbarScriptElement.attr("id", "cwc-navbar-source")
  body.append(navbarScriptElement)
  navbarElement.prependTo(body)

}

function isInCWCMode(referrer) {
  return verifyWorkspaceCloudUser() || referredFromCitrixCloudDomain(referrer);

  /**
  TODO - Remove after Synergy. Checking if the referrer is from
  *.cloudburrito.com, *.cloud.com, *.tryworkspaces.com
  **/
  function referredFromCitrixCloudDomain(referrer){
    if(!referrer) return false;
    if(referrer.indexOf('cloud.com') > -1) return true;
    if(referrer.indexOf('cloudburrito.com') > -1) return true;
    if(referrer.indexOf('cloud.com') > -1) return true;
    if(referrer.indexOf('tryworkspaces.com') > -1) return true;
    return false;
  }

  function verifyWorkspaceCloudUser() {
    if (window.location.pathname === '/workspacecloud') return true
    if (window.localStorage.getItem('customer')) return true

    return false
  }
}
