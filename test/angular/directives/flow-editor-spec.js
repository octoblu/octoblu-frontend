describe('flowEditor', function () {
  var scope, element;

  beforeEach(function () {
    module('octobluApp');
    module('angular/directives/flow/flow-editor/flow-editor.html');

    inject(function($rootScope, $compile){
      scope = $rootScope.$new();
      scope.flow = {
        nodes: [],
        flows: []
      };

      element = angular.element('<flow-editor flow="flow">');
      $compile(element, scope);
      scope.$digest();
    });
  });
});
