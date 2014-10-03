describe('ParamInputController', function () {
  'use strict';
  var scope, sut, paramDefinition1, paramDefinition2;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      sut = $controller('ParamInputController', {$scope: scope});
    });
  });

  describe('when there are some params', function () {
    beforeEach(function () {
      scope.paramDefinitions = [paramDefinition1, paramDefinition2];
    });

    describe('when ngModel is blank', function () {
      beforeEach(function () {
        scope.ngModel = {};
        scope.$digest();
      });

      it('should update params with the paramDefinition', function () {
        expect(scope.params).to.have.property('m');
        expect(scope.params.m).to.equal('');
      });

      it('should not set m on the ngModel', function () {
        expect(scope.ngModel).not.to.have.property('m');
      });

      it('should update params with the foo paramDefinition and default value', function () {
        expect(scope.params).to.have.property('foo');
        expect(scope.params.foo).to.equal('foursquare');
      });

      it('should update ngModel with the foo paramDefinition and default value', function () {
        expect(scope.ngModel).to.have.property('foo');
        expect(scope.ngModel.foo).to.equal('foursquare');
      });
    });
  });

  describe('when there are one paramDefinition(s)', function () {
    beforeEach(function () {
      scope.paramDefinitions = [paramDefinition1];
    });

    describe('when ngModel is blank', function () {
      beforeEach(function () {
        scope.ngModel = {};
        scope.$digest();
      });

      it('should update params with the m paramDefinition', function () {
        expect(scope.params).to.have.property('m');
        expect(scope.params.m).to.equal('');
      });

      it('should not add the foo paramDefinition to params', function () {
        expect(scope.params).not.to.have.property('foo');
      });

      it('should not add the foo paramDefinition to ngModel', function () {
        expect(scope.ngModel).not.to.have.property('foo');
      });

    });
  });

  paramDefinition1 = {
    name: 'm',
    required: true,
    style: "query",
    doc: {
      t: "swarm or foursquare"
    }
  };

  paramDefinition2 = {
    name: 'foo',
    required: true,
    style: "query",
    default: 'foursquare',
    doc: {
      t: "sample foo param"
    }
  };
});
