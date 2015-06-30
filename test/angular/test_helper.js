angular.module('octobluApp', ['ui.router']);
window.expect = chai.expect;
window.When = window.when
window.meshblu = {
  createConnection: function(){
    return new EventEmitter();
  }
}

beforeEach(function () {
  module('octobluApp', function($provide) {
    $provide.value('$mdToast', {});
    $provide.value('$mdDialog', {});
    $provide.constant('OCTOBLU_API_URL', '');
    $provide.constant('OCTOBLU_ICON_URL', '');
  });
});
