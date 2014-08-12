describe('FlowService', function () {
  var sut, $httpBackend, fakeUUIDService;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide){
      fakeUUIDService = new FakeUUIDService();
      $provide.value('UUIDService', fakeUUIDService);
    });

    inject(function(FlowService, _$httpBackend_){
      sut          = FlowService;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('pages/octoblu.html').respond(200);
      $httpBackend.whenGET('pages/home.html').respond(200);
      $httpBackend.flush();
    });
  });

  describe('saveAllFlows', function () {
    describe('when it receives one workspace', function () {
      it('call $http.put for each flow', function (done) {
        $httpBackend.expectPUT("/api/flows/my-uuid").respond(204);

        var workspace = {flowId: "my-uuid", name: "Sheet 1", nodes: [], links: []};

        sut.saveAllFlows([workspace]).then(function(){
          done();
        }, done);

        $httpBackend.flush();
      });

      afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });

    describe('when it receives two workspaces', function () {
      it('call $http.get for each flow', function (done) {
        $httpBackend.expectPUT("/api/flows/one-value").respond(204);
        $httpBackend.expectPUT("/api/flows/two-value").respond(204);
        var workspaces = [
          {flowId: "one-value", name: "Sheet 1", nodes: [], links: []},
          {flowId: "two-value", name: "Sheet 1", nodes: [], links: []}
        ];

        sut.saveAllFlows(workspaces).then(function(){
          done();
        }, done);

        $httpBackend.flush();
      });

      afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });
  });

  describe('saveAllFlowsAndDeploy', function () {
    it('should $http.put for each flow', function (done) {
      $httpBackend.expectPUT("/api/flows/my-uuid").respond(204);
      $httpBackend.expectPOST("/api/flow_deploys").respond(201);

      var workspace = {flowId: "my-uuid", name: "Sheet 1", nodes: [], links: []};
      sut.saveAllFlowsAndDeploy([workspace]).then(function(){
        done();
      }, done);

      $httpBackend.flush();
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

  describe('#getAllFlows', function () {
    it('should return an array', function (done) {
      $httpBackend.expectGET('/api/flows').respond(200, ['hi']);

      sut.getAllFlows().then(function (flows) {
        expect(flows.length).to.eq(1);
        done();
      }, done);

      $httpBackend.flush();
    });

    it('should return an array with objects', function (done) {
      $httpBackend.expectGET('/api/flows').respond(200, [{}]);

      sut.getAllFlows().then(function (flows) {
        expect(flows[0]).to.be.instanceof(Object);
        done();
      }, done);

      $httpBackend.flush();
    });

    describe('when the server gives us zero flows', function(){
      beforeEach(function(){
        $httpBackend.expectGET('/api/flows').respond(200, []);
      });

      it('should inject an empty flow with a name and flowId', function(done){
        fakeUUIDService.v1.returns = 'fakeFlowID';
        sut.getAllFlows().then(function (flows) {
          expect(flows[0].name).to.equal('Flow 1');
          expect(flows[0].flowId).to.equal('fakeFlowID');
          done();
        }, done);

        $httpBackend.flush();
      });
    });
  });

  describe('#newFlow', function(){
    it('should return an object', function(){
      expect(sut.newFlow()).to.be.instanceof(Object);
    });

    it('should accept a default name', function(){
      expect(sut.newFlow('foo').name).to.equal('foo');
    });

    it('should accept a default name', function(){
      expect(sut.newFlow('food').name).to.equal('food');
    });

    it('should have nodes', function() {
      expect(sut.newFlow().nodes).to.deep.equal([]);
    });
 
    it('should have links', function() {
      expect(sut.newFlow().links).to.deep.equal([]);
    });

    it('should generate a flowId', function(){
      fakeUUIDService.v1.returns = 'some-thing';
      expect(sut.newFlow().flowId).to.deep.equal('some-thing');
    });

    it('should generate a flowId', function(){
      fakeUUIDService.v1.returns = 'some-thing-else';
      expect(sut.newFlow().flowId).to.deep.equal('some-thing-else');
    });
  });

  describe('#deleteFlow', function(){

    it('should exist', function(){
      var flowId = '123456';
      $httpBackend.expectDELETE('/api/flows/' + flowId).respond(200);
      sut.deleteFlow(flowId);
      $httpBackend.flush();
    });
  });

  var FakeUUIDService = function(){
    var _this = this;

    _this.v1 = sinon.spy(function(){
      return _this.v1.returns;
    });

    return this;
  };
});
