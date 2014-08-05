describe('FlowRenderer', function () {
  var sut, flow, FakeFlowNodeRenderer, FakeFlowLinkRenderer, FakeDispatch;


  beforeEach(function () {
    module('octobluApp', function ($provide) {
      FakeDispatch = {
        flowChanged: sinon.spy()
      };

      sinon.stub(d3, 'dispatch').returns(FakeDispatch);

      FakeFlowNodeRenderer = {
        eventListeners: {},
        render: sinon.spy(),
        on: function (eventName, callback) {
          FakeFlowNodeRenderer.eventListeners[eventName] = callback;
        }
      };

      $provide.value('FlowNodeRenderer', function () {
        return FakeFlowNodeRenderer;
      });

      FakeFlowLinkRenderer = {
        render: sinon.spy(),
        updateLinks: sinon.spy()
      };

      $provide.value('FlowLinkRenderer', function () {
        return FakeFlowLinkRenderer;
      });

    });
  });

  afterEach(function(){
    d3.dispatch.restore();
  });

  describe('when flow has empty nodes', function(){
    beforeEach(function(){
      inject(function (_FlowRenderer_) {
        flow = {nodes: [], links: []};
        sut = new _FlowRenderer_(d3.select('.foo'));
        sut.render(flow);
      });
    });

    it('should call render on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.render).to.have.been.calledWith([]);
    });

    it('should call render on FlowLinkRenderer', function () {
      expect(FakeFlowLinkRenderer.render).to.have.been.calledWith([]);
    });

    it('should listen for nodeMoved on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.eventListeners.nodeMoved).to.be.instanceof(Object);
    });

    it('should listen for nodeMoved on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.eventListeners.nodeMoved).to.be.instanceof(Object);
    });

    it('should call updateLinks when a node moves', function () {
      FakeFlowNodeRenderer.eventListeners.nodeMoved([]);
      expect(FakeFlowLinkRenderer.updateLinks).to.be.calledWith([]);
    });

    it('should listen for nodeChanged on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.eventListeners.nodeChanged).to.be.instanceof(Object);
    });

    it('should emit a flowChange event on dispatch', function () {
      FakeFlowNodeRenderer.eventListeners.nodeChanged([]);
      expect(FakeDispatch.flowChanged).to.be.calledWith(flow);
    });
  });

  describe('when flow has two nodes', function() {
    var node1, node2, link1, link2;

    beforeEach(function () {
      node1 = {id: '1'};
      node2 = {id: '2'};
      link1 = {from: '1'};
      link2 = {from: '2'};
      link3 = {to: '1'};
      inject(function (_FlowRenderer_) {
        flow = {nodes: [node1, node2], links: [link1, link2, link3]};
        sut = new _FlowRenderer_(d3.select('.foo'));
        sut.render(flow);
      });
    });

    it('should call render on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.render).to.have.been.calledWith([node1, node2]);
    });

    it('should call render on FlowLinkRenderer', function () {
      expect(FakeFlowLinkRenderer.render).to.have.been.calledWith([link1, link2, link3]);
    });

    it('should call updateLinks when a node moves', function () {
      FakeFlowNodeRenderer.eventListeners.nodeMoved(node1);
      expect(FakeFlowLinkRenderer.updateLinks).to.be.calledWith([link1, link3]);
    });
  });

});