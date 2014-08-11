describe('FlowNodeTypeService', function () {
  var sut, $httpBackend, fakeUUIDService;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide){
      fakeUUIDService = new FakeUUIDService();
      $provide.value('UUIDService', fakeUUIDService);
    });

    inject(function (FlowNodeTypeService, _$httpBackend_) {
      sut = FlowNodeTypeService;
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

  describe('.createFlowNode', function () {
    it('should be callable function', function () {
      sut.createFlowNode({});
    });

    it('setting the type', function () {
      var flowNodeType, expectedFlowNode;

      flowNodeType = {name: 't1000'};
      flowNode     = sut.createFlowNode(flowNodeType);

      expect(flowNode.type).to.deep.equal('t1000');
    });

    it('should set the type to the flowNodeType name', function(){
      var flowNodeType, flowNode;

      flowNodeType = {name: 't100'};
      flowNode     = sut.createFlowNode(flowNodeType);

      expect(flowNode.type).to.deep.equal('t100');
    });

    it('should set the class to the flowNodeType class', function(){
      var flowNodeType, flowNode;

      flowNodeType = {class: 'spaz'};
      flowNode     = sut.createFlowNode(flowNodeType);

      expect(flowNode.class).to.deep.equal('spaz');
    });

    it('should set the class to the flowNodeType class', function(){
      var flowNodeType, flowNode;

      flowNodeType = {class: 'bork'};
      flowNode     = sut.createFlowNode(flowNodeType);

      expect(flowNode.class).to.deep.equal('bork');
    });

    it('should set the input to the flowNodeType class', function(){
      var flowNodeType, flowNode;

      flowNodeType = {input: 1};
      flowNode     = sut.createFlowNode(flowNodeType);

      expect(flowNode.input).to.equal(1);
    });

    it('should set the input to the flowNodeType class', function(){
      var flowNodeType, flowNode;

      flowNodeType = {input: 2};
      flowNode     = sut.createFlowNode(flowNodeType);

      expect(flowNode.input).to.equal(2);
    });

    it('should set the output to the flowNodeType class', function(){
      var flowNodeType, flowNode;

      flowNodeType = {output: 2};
      flowNode     = sut.createFlowNode(flowNodeType);

      expect(flowNode.output).to.equal(2);
    });

    it('should set the output to the flowNodeType class', function(){
      var flowNodeType, flowNode;

      flowNodeType = {output: 3};
      flowNode     = sut.createFlowNode(flowNodeType);

      expect(flowNode.output).to.equal(3);
    });

    it('should set a uuid to the flowNodeType uuid', function(){
      var flowNodeType, flowNode;

      fakeUUIDService.v1.returns = 'something-special';
      flowNode     = sut.createFlowNode({});

      expect(flowNode.id).to.equal('something-special');
    });

    it('should set a uuid to the flowNodeType uuid', function(){
      var flowNodeType, flowNode;

      fakeUUIDService.v1.returns = 'something-different';
      flowNode     = sut.createFlowNode({});

      expect(flowNode.id).to.equal('something-different');
    });

    it('should clone the defaults to the node', function () {
      var flowNodeType, flowNode;

      flowNodeType = {defaults: {foo: 'bar'}};
      flowNode = sut.createFlowNode(flowNodeType);

      expect(flowNode.foo).to.equal('bar');
    });

    it('should clone the defaults to the node', function () {
      var flowNodeType, flowNode;

      flowNodeType = {defaults: {bar : 'foo'}};
      flowNode = sut.createFlowNode(flowNodeType);

      expect(flowNode.bar).to.equal('foo');
    });

    it('should deeeep clone the defaults to the node', function () {
      var flowNodeType, flowNode;

      flowNodeType = {defaults: {bar : {foo: 'baz'}}};
      flowNode = sut.createFlowNode(flowNodeType);
      flowNodeType.defaults.bar.foo = 'something else';

      expect(flowNode.bar).to.deep.equal({foo: 'baz'});
    });

    it('should not allow the defaults to override the name', function () {
      var flowNodeType, flowNode;

      flowNodeType = {name: 'foo', defaults: {name: 'bar'}};
      flowNode = sut.createFlowNode(flowNodeType);

      expect(flowNode.type).to.equal('foo');
    });
  });

  describe('.getFlowNodeType', function () {
    it('should return a single flowNodeType', function (done) {
      $httpBackend.expectGET('/api/flow_node_types').respond(200, [{name: 'function', foo: 'bar'}, {name: 'inject', bar: 'foo'}]);

      sut.getFlowNodeType('function').then(function (flowNodeType) {
        expect(flowNodeType).to.deep.equal({name: 'function', foo: 'bar'});
        done();
      }, done);

      $httpBackend.flush();
    });

    it('should return a single flowNodeType', function (done) {
      $httpBackend.expectGET('/api/flow_node_types').respond(200, [{name: 'function', foo: 'bar'}, {name: 'inject', bar: 'foo'}]);

      sut.getFlowNodeType('inject').then(function (flowNodeType) {
        expect(flowNodeType).to.deep.equal({name: 'inject', bar: 'foo'});
        done();
      }, done);

      $httpBackend.flush();
    });
  });

  describe('.getFlowNodeTypes', function () {
    it('should return an array', function (done) {
      $httpBackend.expectGET('/api/flow_node_types').respond(200, ['hi']);

      sut.getFlowNodeTypes().then(function (flows) {
        expect(flows.length).to.eq(1);
        done();
      }, done);

      $httpBackend.flush();
    });
    it('should return an array with objects', function (done) {
      $httpBackend.expectGET('/api/flow_node_types').respond(200, [{}]);

      sut.getFlowNodeTypes().then(function (flows) {
        expect(flows[0]).to.be.instanceof(Object);
        done();
      }, done);

      $httpBackend.flush();
    });
  });
});

var FakeUUIDService = function(){
  var _this = this;

  _this.v1 = sinon.spy(function(){
    return _this.v1.returns;
  });

  return _this;
};
