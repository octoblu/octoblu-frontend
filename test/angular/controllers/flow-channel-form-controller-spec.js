describe('FlowChannelFormController', function () {
  var scope, sut, resource1, resource2;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      resource1 = {path: '/adams', httpMethod: 'PATCH'};
      resource2 = {path: '/42', httpMethod: 'WAIT'};
      scope.node = {application: {resources: [resource1, resource2]}};
      sut   = $controller('FlowChannelFormController', {$scope: scope});
      scope.$digest();
    });
  });

  describe('when scope.node.path and method are updated', function () {
    beforeEach(function(){
      scope.node.path   = resource2.path;
      scope.node.method = resource2.httpMethod;
      scope.$digest();
    });

    it('should select the second resource', function () {
      expect(scope.selectedEndpoint).to.equal(resource2);
    });
  });

  describe('when the scope.selectedEndpoint changes', function () {
    var resource3;

    beforeEach(function(){
      // [{"name":"{lock_id}","required":true,"style":"query","doc":{"t":"the id of the Lockitron to lock"}}]
      resource3 = {path: '/api/v42/do', httpMethod: 'DANCE', params: [{name: 'foo'}]};
      scope.node.application.resources.push(resource3);
      scope.selectedEndpoint = resource3;
      scope.$digest();
    });

    it('should set path on scope.node', function () {
      expect(scope.node.path).to.equal('/api/v42/do');
    });

    it('should set method on scope.node', function () {
      expect(scope.node.method).to.equal('DANCE');
    });

    it('should set params on the node', function () {
      expect(scope.node.params).to.deep.equal({foo: ''});
    });
  });

  describe('when the scope.selectedEndpoint changes', function () {
    var resource3;

    beforeEach(function(){
      resource3 = {path: '/asdf', httpMethod: 'ASDF', params: [{name: 'bar'}]};
      scope.node.application.resources.push(resource3);
      scope.selectedEndpoint = resource3;
      scope.$digest();
    });

    it('should set path on scope.node', function () {
      expect(scope.node.path).to.equal('/asdf');
    });

    it('should set method on scope.node', function () {
      expect(scope.node.method).to.equal('ASDF');
    });

    it('should set different params on the node', function () {
      expect(scope.node.params).to.deep.equal({bar: ''});
    });
  });

  describe('when the scope.selectedEndpoint changes and we already have a param value', function () {
    var resource3;

    beforeEach(function(){
      scope.node.params = {bar: 'something'};
      resource3 = {path: '/asdf', httpMethod: 'ASDF', params: [{name: 'bar'}]};
      scope.node.application.resources.push(resource3);
      scope.selectedEndpoint = resource3;
      scope.$digest();
    });

    it('should use the existing bar value', function () {
      expect(scope.node.params).to.deep.equal({bar: 'something'});
    });
  });
});
