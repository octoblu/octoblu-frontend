$(document).ready(function() {
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
