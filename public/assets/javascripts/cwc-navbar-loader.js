$(document).ready(function() {
  if (!verifyWorkspaceCloudUser()) return

  var body = $('body');
  var navbarElement = $("<cwc-navbar></cwc-navbar>")
  var navbarScriptElement = $("<script></script>");

  navbarElement.attr("domain", "https://workspace.tryworkspaces.com");
  navbarElement.attr("logoff-event", "$octobluUserLoggedOff");
  navbarScriptElement.attr("src", "https://workspace.tryworkspaces.com/navbar/scripts/cwc-navbar.min.js");
  navbarScriptElement.attr("id", "cwc-navbar-source");
  body.append(navbarScriptElement);
  navbarElement.prependTo(body);
});

function verifyWorkspaceCloudUser() {
  if (window.location.pathname === '/workspacecloud') return true
  if (window.localStorage.getItem('customer')) return true

  return false;
}
