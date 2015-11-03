$(document).ready(function() {
  if(window.location.hostname === "octoblu.cloud.com"){
    var navbarElement = $("<cwc-navbar></cwc-navbar>")
    var navbarScriptElement = $("<script></script>");
    navbarElement.attr("domain", "https://console-eastus-bvtrelease-a.ctxwsdev.net");
    navbarElement.attr("logoff-event", "$octobluUserLoggedOff"); 
    navbarScriptElement.attr("src", "https://console-eastus-bvtrelease-a.ctxwsdev.net/navbar/scripts/cwc-navbar.js");
    navbarScriptElement.attr("id", "cwc-navbar-source");
    var body = $('body');
    body.append(navbarScriptElement);
    navbarElement.prependTo(body);
  }
});
