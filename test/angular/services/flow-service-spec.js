describe('FlowService', function () {
  var sut, $httpBackend, fakeUUIDService;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide){
      fakeUUIDService = new FakeUUIDService();
      $provide.value('UUIDService', fakeUUIDService);
      $provide.value('$cookies', {});
      $provide.value('reservedProperties', []);
      $provide.value('$intercom', {boot: sinon.stub()});
      $provide.value('$intercomProvider', {});
      $provide.constant('MESHBLU_HOST', '');
      $provide.constant('MESHBLU_PORT', '');
      $provide.constant('OCTOBLU_ICON_URL', '');
    });

    inject(function(FlowService, _$httpBackend_){
      sut          = FlowService;
      $httpBackend = _$httpBackend_;
    });
  });

  describe('#createFlow', function () {
    it('should return a flow', function (done) {
      $httpBackend.expectPOST('/api/flows').respond(201, {flowId:'1'});

      sut.createFlow().then(function (flow) {
        expect(flow.flowId).to.eq('1');
        done();
      }, done);

      $httpBackend.flush();
    });
  });

  describe('#getAllFlows', function () {
    it('should return an array', function (done) {
      $httpBackend.expectGET('/api/flows').respond(200, [{flowId: 'h1'}]);
      $httpBackend.expectGET('/api/flow_node_types').respond(200, []);

      sut.getAllFlows().then(function (flows) {
        expect(flows.length).to.eq(1);
        done();
      }, done);

      $httpBackend.flush();
    });

    it('should return an array with objects', function (done) {
      $httpBackend.expectGET('/api/flows').respond(200, [{flowId: 2}]);
      $httpBackend.expectGET('/api/flow_node_types').respond(200, []);

      sut.getAllFlows().then(function (flows) {
        expect(flows[0]).to.be.instanceof(Object);
        done();
      }, done);

      $httpBackend.flush();
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

  describe('#selectNode', function(){
    var selectedFlowNode, flow;
    beforeEach(function(){
      flow = { nodes: [], links: [] };
      selectedFlowNode = { type: 'crow' };

      sut.setActiveFlow(flow);
      sut.selectNode(selectedFlowNode);
    });

    it('should set selectedFlowNode on the flow', function(){
      expect(flow.selectedFlowNode).to.equal(selectedFlowNode);
    });

  });

  describe('#addNodeFromFlowNodeType', function(){

    var flow;

    describe('when it is called', function(){

      beforeEach(function(){
        flow = { nodes: [], links: [] };

        sut.setActiveFlow(flow);
        sut.addNodeFromFlowNodeType({type: 'function'});
      });

      it('should set add a node to the flow', function(){
        expect(flow.nodes).to.not.be.empty;
      });

      it('should add a node to the flow with the correct type', function(){
        expect(flow.nodes[0].type).to.equal('function');
      });

      it('should add a resourceType of flow-node', function(){
        expect(flow.nodes[0].resourceType).to.equal('flow-node');
      });
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
