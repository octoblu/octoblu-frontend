describe('FlowChannelFormController', function () {
  var scope, sut, channel, resource1, resource2, resource3, fakeChannelService, channelService;

  describe('When the node has channelid = "1"', function(){
    beforeEach(function () {
      module('octobluApp');

      inject(function($controller, $rootScope, $q){
        scope = $rootScope.$new();
        scope.node = {channelid: '1'};
        channelService = new FakeChannelService($q);

        sut   = $controller('FlowChannelFormController', {$scope: scope, channelService: channelService});
        scope.$digest();
      });
    });

    it('should call the channelService getById with 1', function () {
      expect(channelService.getById).to.have.been.calledWith('1');
    });

    describe('when the channelService resolves', function () {
      beforeEach(function () {
        channelService.getById.resolve(channel);
        scope.$digest();
      });

      it('should set resources on the scope', function () {
        expect(scope.resources).to.deep.equal(channel.application.resources);
      });
    });
  });

  describe('When the node has channelid = "2"', function(){
    beforeEach(function () {
      module('octobluApp');

      inject(function($controller, $rootScope, $q){
        scope = $rootScope.$new();
        scope.node = {channelid: '2'};
        channelService = new FakeChannelService($q);

        sut   = $controller('FlowChannelFormController', {$scope: scope, channelService: channelService});
        scope.$digest();
      });
    });

    it('should call the channelService getById with 2', function () {
      expect(channelService.getById).to.have.been.calledWith('2');
    });
  });

  // describe('when the channel service resolves', function () {
  //   beforeEach(function (done) {
  //     fakeChannelService.getById.resolve(channel);
  //   });
  // });

  resource1  = {path: '/42',    httpMethod: 'WAIT',  params: [{name: 'foo', style: 'query'}, {name: 'uparam', style: 'url'}]};
  resource2  = {path: '/adams', httpMethod: 'PATCH', params: [{name: 'bar', style: 'query'}, {name: 'bparam', style: 'body'}]};
  resource3  = {path: '/asdf',  httpMethod: 'ASDF',  params: [{name: 'bar', style: 'query'}, {name: 'bparam', style: 'body'}]};
  channel    = {application: {base: '', resources: [resource1, resource2]}};

  var FakeChannelService = function($q){
    var q = $q.defer();

    this.getById = sinon.spy(function(){
      return q.promise;
    });

    this.getById.resolve = q.resolve;
    return this;
  };
});
