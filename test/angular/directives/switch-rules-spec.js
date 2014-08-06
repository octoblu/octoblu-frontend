describe('switchRules', function () {
  var scope, element;

  beforeEach(function () {
    module('octobluApp');
    module('angular/directives/switch-rules/switch-rules.html');

    inject(function($rootScope, $compile){
      scope = $rootScope.$new();
      scope.rules = [];

      element = angular.element('<switch-rules ng-model="rules">');
      $compile(element, scope);
      scope.$digest();
    });
  });

  it('should replace switch-rules with a div', function () {
    expect(element.prop('tagName')).to.equal('FIELDSET');
  });
});
