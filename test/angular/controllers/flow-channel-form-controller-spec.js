describe('FlowChannelFormController', function () {
  var scope, sut, firstResource, secondResource;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      firstResource = {path: '/adams', httpMethod: 'PATCH'};
      secondResource = {path: '/42', httpMethod: 'WAIT'};
      scope.node = {application: {resources: [firstResource, secondResource]}};
      sut   = $controller('FlowChannelFormController', {$scope: scope});
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  it('should have endpoints', function(){
    expect(scope.endpoints).to.include({label: 'PATCH /adams', value: firstResource});
  });

  it('should add an empty params hash to the editorNode', function () {
    expect(scope.node.params).to.deep.equal({});
  });

  describe('when the scope.node.application.resources changes', function () {
    var resource;

    beforeEach(function(){
      resource = {path: '/api/v1/devices', httpMethod: 'GET'};
      scope.node.application.resources.push(resource);
      scope.$digest();
    });

    it('add the resource to the endpoints', function () {
      expect(scope.endpoints).to.include({label: 'GET /api/v1/devices', value: resource});
    });

    it('should select the first endpoint as default', function() {
      expect(scope.selectedEndpoint).to.deep.equal({label: 'PATCH /adams', value: firstResource});
    });
  });

  describe('when scope.flowEditor.sortedIndex.application.resources has two devices', function () {
    beforeEach(function(){
      scope.$digest();
      scope.node.path   = '/42';
      scope.node.method = 'WAIT';
      scope.$digest();
    });

    it('should select the second resource', function () {
      expect(scope.selectedEndpoint.label).to.deep.equal('WAIT /42');
      expect(scope.selectedEndpoint).to.deep.equal({label: 'WAIT /42', value: secondResource});
    });
  });

  describe('when the scope.selectedEndpoint changes', function () {
    var resource3;

    beforeEach(function(){
      resource3 = {path: '/api/v42/do', httpMethod: 'DANCE'};
      scope.node.application.resources.push(resource3);
      scope.selectedEndpoint = {value: resource3};
      scope.$digest();
    });

    it('should set path on scope.node', function () {
      expect(scope.node.path).to.equal('/api/v42/do');
    });

    it('should set method on scope.node', function () {
      expect(scope.node.method).to.equal('DANCE');
    });
  });

  describe('when the scope.selectedEndpoint changes', function () {
    beforeEach(function(){
      scope.selectedEndpoint = {value: {path: '/42', httpMethod: 'WAIT'}};
      scope.$digest();
    });

    it('should set path on scope.node', function () {
      expect(scope.node.path).to.equal('/42');
    });

    it('should set method on scope.node', function () {
      expect(scope.node.method).to.equal('WAIT');
    });
  });
});
