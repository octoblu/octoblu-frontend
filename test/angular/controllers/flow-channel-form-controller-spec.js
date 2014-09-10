describe('FlowChannelFormController', function () {
  var scope, sut, channel, resource1, resource2, resource3, fakeChannelService;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope, $q){
      scope = $rootScope.$new();
      scope.node = {};
      resource1  = {path: '/adams', httpMethod: 'PATCH', params: [{name: 'bar', style: 'query'}, {name: 'bparam', style: 'body'}]};
      resource2  = {path: '/42',    httpMethod: 'WAIT',  params: [{name: 'foo', style: 'query'}, {name: 'uparam', style: 'url'}]};
      resource3  = {path: '/asdf',  httpMethod: 'ASDF',  params: [{name: 'bar', style: 'query'}, {name: 'bparam', style: 'body'}]};
      channel    = {application: {resources: [resource1, resource2]}};

      fakeChannelService = new FakeChannelService($q);
      fakeChannelService.getById.resolve(channel);

      sut   = $controller('FlowChannelFormController', {$scope: scope, channelService: fakeChannelService});
      scope.$digest();
    });
  });

  describe('when scope.node.path and method are updated', function () {
    beforeEach(function(){
      scope.resources   = channel.application.resources;
      scope.node.path   = resource2.path;
      scope.node.method = resource2.httpMethod;
      scope.$digest();
    });

    it('should select the second resource', function () {
      expect(scope.selectedEndpoint).to.equal(resource2);
    });
  });

  describe('when the scope.selectedEndpoint changes', function () {
    beforeEach(function(){
      scope.selectedEndpoint = resource2;
      scope.$digest();
    });

    it('should set path on scope.node', function () {
      expect(scope.node.path).to.equal(resource2.path);
    });

    it('should set method on scope.node', function () {
      expect(scope.node.method).to.equal(resource2.httpMethod);
    });
  });


  var FakeChannelService = function($q){
    var q = $q.defer();

    this.getById = function(){
      return q.promise;
    }

    this.getById.resolve = q.resolve;
    return this;
  }
});
