describe('OmniService', function () {
  var sut, fakeFlowNodeTypeService, fakeFlowService, fakeNodeTypeService, $rootScope, $q;

  beforeEach(function () {
    module('octobluApp');

    module('octobluApp', function($provide){
      fakeFlowNodeTypeService = new FakeFlowNodeTypeService();
      fakeNodeTypeService = new FakeNodeTypeService();
      fakeFlowService = new FakeFlowService();

      $provide.value('FlowNodeTypeService', fakeFlowNodeTypeService);
      $provide.value('NodeTypeService', fakeNodeTypeService);
      $provide.value('FlowService', fakeFlowService);
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
        promise.then(function(result){
          expect(result).to.deep.equal([]);
          done();
        }).catch(done);

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

  describe('selectItem', function () {
    describe('when FlowNodeTypeService and NodeTypeService respond with something', function () {
      var flowNode, flowNodeType, nodeType;

      beforeEach(function (done) {
        flowNode     = {type: 'flowNode'};
        flowNodeType = {type: 'flowNodeType'};
        nodeType     = {type: 'nodeType'};

        sut.fetch([flowNode]).then(function(){ done() });
        fakeFlowNodeTypeService.getFlowNodeTypes.resolve([flowNodeType]);
        fakeNodeTypeService.getNodeTypes.resolve([nodeType]);
        $rootScope.$apply();
      });

      describe('when the selectedItem is a flowNode', function () {
        var promise;

        beforeEach(function () {
          promise = sut.selectItem(flowNode);
        });

        it('should select the node in the flow', function () {
          expect(fakeFlowService.selectNode).to.have.been.calledWith(flowNode);
        });

        it('should not call FlowService.addNodeFromFlowNodeType', function () {
          expect(fakeFlowService.addNodeFromFlowNodeType).not.to.have.been.called;
        });

        it('should resolve with the a null item', function (done) {
          promise.then(function(item){
            expect(item).to.be.null;
            done();
          });

          $rootScope.$apply();
        });
      });

      describe('when the selectedItem is a flowNodeType', function () {
        var promise;

        beforeEach(function () {
          promise = sut.selectItem(flowNodeType);
        });

        it('should call FlowService.addNodeFromFlowNodeType', function () {
          expect(fakeFlowService.addNodeFromFlowNodeType).to.have.been.calledWith(flowNodeType);
        });

        it('should not call FlowService.selectNode', function () {
          expect(fakeFlowService.selectNode).not.to.have.been.called;
        });

        it('should resolve with the a null item', function (done) {
          promise.then(function(item){
            expect(item).to.be.null;
            done();
          });

          $rootScope.$apply();
        });
      });

      describe('when the selectItem is a nodeType', function () {
        var promise;

        beforeEach(function() {
          promise = sut.selectItem(nodeType);
        });

        it('should not call FlowService.selectNode', function () {
          expect(fakeFlowService.selectNode).not.to.have.been.calledWith(nodeType);
        });

        it('should not call FlowService.addNodeFromFlowNodeType', function () {
          expect(fakeFlowService.addNodeFromFlowNodeType).not.to.have.been.called;
        });

        it('should resolve with the original item', function (done) {
          promise.then(function(item){
            expect(item).to.equal(nodeType);
            done();
          });

          $rootScope.$apply();
        });
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

  var FakeFlowService = function(){
    var self = this;
    self.addNodeFromFlowNodeType = sinon.spy();
    self.selectNode = sinon.spy();
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
