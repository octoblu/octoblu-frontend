angular.module('octobluApp', ['ui.router']);
window.expect = chai.expect;
window.When = window.when
window.meshblu = {
  createConnection: function(){
    return new EventEmitter();
  }
}
window.MeshbluHttp = function(){};
window.MeshbluFirehoseSocketIO = function(){};

beforeEach(function () {
  module('octobluApp', function($provide) {
    $provide.value('$mdToast', {});
    $provide.value('$mdDialog', {});
    $provide.constant('OCTOBLU_API_URL', '');
    $provide.constant('OCTOBLU_ICON_URL', '');
    $provide.constant('MESHBLU_PORT', 0xd00d);
    $provide.constant('MESHBLU_HOST', 'localhost');
    $provide.constant('OCTOBLU_ICON_URL', '');
    $provide.constant('FLOW_LOGGER_UUID', 'asdf');
    $provide.constant('CLUSTER_DOMAIN', 'octoblu.dev');
  });
});
