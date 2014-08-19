describe('FlowChannelFormController', function () {
  var scope, sut, firstResource, secondResource;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      firstResource = {path: '/adams', httpMethod: 'PATCH'};
      secondResource = {path: '/42', httpMethod: 'WAIT'};
      scope.flowEditor = {editorNode: {application: {resources: [firstResource, secondResource]}}};
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
    expect(scope.flowEditor.editorNode.params).to.deep.equal({});
  });

  describe('when the scope.flowEditor.editorNode.application.resources changes', function () {
    var resource;

    beforeEach(function(){
      resource = {path: '/api/v1/devices', httpMethod: 'GET'};
      scope.flowEditor.editorNode.application.resources.push(resource);
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
    var resource1, resource2;

    beforeEach(function(){
      resource1 = {path: '/api/v1/devices', httpMethod: 'GET'};
      resource2 = {path: '/api/v2/more_devices', httpMethod: 'POST'};
      scope.flowEditor.editorNode.application.resources.push(resource1);
      scope.flowEditor.editorNode.application.resources.push(resource2);
      scope.flowEditor.editorNode.path   = '/api/v2/more_devices';
      scope.flowEditor.editorNode.method = 'POST';
      scope.$digest();
    });

    it('should select the second resource', function () {
      expect(scope.selectedEndpoint.label).to.deep.equal('POST /api/v2/more_devices');
      expect(scope.selectedEndpoint).to.deep.equal({label: 'POST /api/v2/more_devices', value: resource2});
    });
  });

  describe('when the scope.selectedEndpoint changes', function () {
    var resource3;

    beforeEach(function(){
      resource3 = {path: '/api/v42/do', httpMethod: 'DANCE'};
      scope.flowEditor.editorNode.application.resources.push(resource3);
      scope.selectedEndpoint = {value: resource3};
      scope.$digest();
    });

    it('should set path on scope.flowEditor.editorNode', function () {
      expect(scope.flowEditor.editorNode.path).to.equal('/api/v42/do');
    });

    it('should set method on scope.flowEditor.editorNode', function () {
      expect(scope.flowEditor.editorNode.method).to.equal('DANCE');
    });
  });

  describe('when the scope.selectedEndpoint changes', function () {
    beforeEach(function(){
      scope.selectedEndpoint = {value: {path: '/42', httpMethod: 'WAIT'}};
      scope.$digest();
    });

    it('should set path on scope.flowEditor.editorNode', function () {
      expect(scope.flowEditor.editorNode.path).to.equal('/42');
    });

    it('should set method on scope.flowEditor.editorNode', function () {
      expect(scope.flowEditor.editorNode.method).to.equal('WAIT');
    });
  });
});
