function loadCWCNavBar(options) {
  if (!isInCWCMode()) return
  window.cwcSessionId = localStorage.getItem("workspaceCloudSessionId")
  window.cwcCustomerId = localStorage.getItem("workspaceCloudCustomerId")

  var body = $("body")
  var navbarElement = $("<cwc-navbar></cwc-navbar>")
  var navbarScriptElement = $("<script></script>")

  navbarElement.attr("domain", "https://citrix.cloud.com")
  navbarElement.attr("logoff-event", "$octobluUserLoggedOff")
  navbarScriptElement.attr("src", "https://citrix.cloud.com/navbar/scripts/cwc-navbar.min.js")
  navbarScriptElement.attr("id", "cwc-navbar-source")
  body.append(navbarScriptElement)
  navbarElement.prependTo(body)
}

function isInCWCMode() {
  return localStorage.getItem("workspaceCloudCustomerId") && localStorage.getItem("workspaceCloudSessionId")
}
