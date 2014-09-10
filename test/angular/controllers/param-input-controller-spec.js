describe('ParamInputController', function () {
  var scope, sut, queryParam, urlParam;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      sut = $controller('ParamInputController', {$scope: scope});
    });
  });

  describe('Given a param style of query and a selected endpoint', function () {
    beforeEach(function () {
      scope.model = {};
      scope.paramStyle = 'query'
      scope.selectedEndpoint = {params: [queryParam, urlParam]};
      scope.$digest();
    });

    it('should populate paramDefinitions with the query params', function () {
      expect(scope.paramDefinitions).to.include(queryParam);
    });

    it('should not include the urlParam', function () {
      expect(scope.paramDefinitions).to.not.include(urlParam);
    });
  });

  describe('Given a param style of url and a selected endpoint', function () {
    beforeEach(function () {
      scope.model = {};
      scope.paramStyle = 'url'
      scope.selectedEndpoint = {params: [queryParam, urlParam]};
      scope.$digest();
    });

    it('should populate paramDefinitions with the urlParam', function () {
      expect(scope.paramDefinitions).to.include(urlParam);
    });

    it('should not include the queryParam', function () {
      expect(scope.paramDefinitions).to.not.include(queryParam);
    });
  });

  describe('Given the model has a property not in the current style params', function () {
    beforeEach(function () {
      scope.model = {foo: 'bar'};
      scope.paramStyle = 'query';
      scope.selectedEndpoint = {params: [queryParam, urlParam]};
      scope.$digest();
    });

    it('should remove the property from model', function () {
      expect(scope.model).not.to.have.property('foo');
    });
  });

  describe('Given the model has a property that is in the urlParams', function () {
    beforeEach(function () {
      scope.model = {foo: 'bar'};
      scope.paramStyle = 'url'
      scope.selectedEndpoint = {params: [queryParam, urlParam]};
      scope.$digest();
    });

    it('should leave the property in the model', function () {
      expect(scope.model).to.have.property('foo');
    });
  });

  describe('Given model has no params and there is a default', function () {
    beforeEach(function () {
      scope.model = {};
      scope.paramStyle = 'query'
      scope.selectedEndpoint = {params: [queryParam, urlParam]};
      scope.$digest();
    });

    it('should set the property on model to the default', function () {
      expect(scope.model).to.have.property('m');
      expect(scope.model.m).to.equal('foursquare');
    });
  });

  describe("Given model has a value and doesn't need the default", function () {
    beforeEach(function () {
      scope.model = {'m': 'swarm'};
      scope.paramStyle = 'query'
      scope.selectedEndpoint = {params: [queryParam, urlParam]};
      scope.$digest();
    });

    it('should set the property on model to the default', function () {
      expect(scope.model).to.have.property('m');
      expect(scope.model.m).to.equal('swarm');
    });

    describe('when the value is set to empty string', function () {
      beforeEach(function () {
        scope.model.m = '';
        scope.$digest();
      });

      it('should remove the property from the model', function () {
        expect(_.keys(scope.model)).not.to.include('m');
      });
    });
  });


  queryParam = {
    name: 'm',
    required: true,
    style: "query",
    default: 'foursquare',
    doc: {
      t: "swarm or foursquare"
    }
  };

  urlParam = {
    name: 'foo',
    required: true,
    style: "url",
    doc: {
      t: "sample foo param"
    }
  };
});
