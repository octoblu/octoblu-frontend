describe('OmniService', function () {
  var sut, fakeFlowNodeTypeService, fakeNodeTypeService, $rootScope, $q;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide){
      fakeFlowNodeTypeService = new FakeFlowNodeTypeService();
      fakeNodeTypeService = new FakeNodeTypeService();

      $provide.value('FlowNodeTypeService', fakeFlowNodeTypeService);
      $provide.value('NodeTypeService', fakeNodeTypeService);
    });

    inject(function(_$httpBackend_){
      var $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('/pages/octoblu.html').respond(200);
      $httpBackend.whenGET('/pages/home.html').respond(200);
      $httpBackend.flush();
    });

    inject(function(OmniService, _$rootScope_, _$q_){
      $q = _$q_;
      sut = OmniService;
      $rootScope = _$rootScope_;
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  describe('when fetch is called with no nodes', function () {
    var promise;

    beforeEach(function () {
      promise = sut.fetch();
    });

    describe('when FlowNodeTypeService and NodeTypeService respond with nothing', function () {
      beforeEach(function () {
        fakeFlowNodeTypeService.getFlowNodeTypes.resolve([]);
        fakeNodeTypeService.getNodeTypes.resolve([]);
      });

      it('should keep its promise with an empty thing', function (done) {
        expect(promise).to.eventually.deep.equal([]).and.notify(done);
        $rootScope.$apply();
      });
    });

    describe('when FlowNodeTypeService and NodeTypeService respond with something', function () {
      var flowNodeType, nodeType;

      beforeEach(function () {
        flowNodeType = {type: 'flowNodeType'};
        nodeType     = {type: 'nodeType'};
        fakeFlowNodeTypeService.getFlowNodeTypes.resolve([flowNodeType]);
        fakeNodeTypeService.getNodeTypes.resolve([nodeType]);
      });

      it('should keep its promise a mashup of the two [flow]nodeTypes', function (done) {
        promise.then(function(omniNodes){
          expect(omniNodes).to.deep.contain(flowNodeType);
          expect(omniNodes).to.deep.contain(nodeType);
          done();
        });
        $rootScope.$apply();
      });
    });
  });

  describe('when fetch is called with some nodes', function () {
    var promise, nodes;

    beforeEach(function () {
      nodes   = [{type: 'node1'}, {type: 'node2'}];
      promise = sut.fetch(nodes);
    });

    describe('when FlowNodeTypeService and NodeTypeService respond with nothing', function () {
      beforeEach(function () {
        fakeFlowNodeTypeService.getFlowNodeTypes.resolve([]);
        fakeNodeTypeService.getNodeTypes.resolve([]);
      });

      it('should keep its promise with the original nodes', function (done) {
        expect(promise).to.eventually.deep.equal(nodes).and.notify(done);
        $rootScope.$apply();
      });
    });
  });

  var FakeFlowNodeTypeService = function(){
    var self = this;
    self.getFlowNodeTypes = function() {
      var deferred = $q.defer();
      self.getFlowNodeTypes.resolve = deferred.resolve;
      return deferred.promise;
    };
    self.getFlowNodeTypes.resolve = function(){};
  };

  var FakeNodeTypeService = function(){
    var self = this;
    self.getNodeTypes = function() {
      var deferred = $q.defer();
      self.getNodeTypes.resolve = deferred.resolve;
      return deferred.promise;
    };
    self.getNodeTypes.resolve = function(){};
  };

});
