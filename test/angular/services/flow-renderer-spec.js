describe('FlowRenderer', function () {
  var sut, flow, FakeFlowNodeRenderer, FakeFlowLinkRenderer, FakeDispatch;
  var renderScope = d3.select('.foo');

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
        render: sinon.spy()
      };

      $provide.value('FlowLinkRenderer', FakeFlowLinkRenderer);

    });
  });

  afterEach(function(){
    d3.dispatch.restore();
  });

  describe('when flow has empty nodes', function(){
    beforeEach(function(){
      inject(function (_FlowRenderer_) {
        flow = {nodes: [], links: []};
        sut = new _FlowRenderer_(renderScope);
        sut.render(flow);
      });
    });

    it('should call render on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.render).to.have.been.calledWith([]);
    });

    it('should listen for nodeMoved on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.eventListeners.nodeMoved).to.be.instanceof(Object);
    });

    it('should listen for nodeMoved on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.eventListeners.nodeMoved).to.be.instanceof(Object);
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
        sut = new _FlowRenderer_(renderScope);
        sut.render(flow);
      });
    });

    it('should call render on FlowNodeRenderer', function () {
      expect(FakeFlowNodeRenderer.render).to.have.been.calledWith([node1, node2]);
    });

    it('should call render on FlowLinkRenderer', function () {
      expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link1, flow.nodes);
      expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link2, flow.nodes);
      expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link3, flow.nodes);
    });

    describe('when a node moves', function(){
      it('should call render when a node moves', function () {
        FakeFlowNodeRenderer.eventListeners.nodeMoved(node1);
        expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link1, flow.nodes);
        expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link2, flow.nodes);
        expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link3, flow.nodes);
      });
    });
  });
});