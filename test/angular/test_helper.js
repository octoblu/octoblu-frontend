angular.module('octobluApp', ['ui.router']);
window.expect = chai.expect;
window.When = window.when
window.meshblu = {
  createConnection: function(){
    return new EventEmitter();
  }
}
