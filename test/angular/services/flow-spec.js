describe('FlowService', function () {
  var sut, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    inject(function(FlowService, _$httpBackend_){
      sut          = FlowService;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('pages/octoblu.html').respond(200);
      $httpBackend.whenGET('pages/home.html').respond(200);
      $httpBackend.flush();
    });
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
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

  describe('.getAllFlows', function () {
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
  });
});
