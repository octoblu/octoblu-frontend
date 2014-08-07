describe('FlowRenderer', function () {
  var sut, flow, FakeFlowNodeRenderer, FakeFlowLinkRenderer, FakeDispatch;
  var renderScope = d3.select('.foo');

  beforeEach(function () {
    module('octobluApp', function ($provide) {
      FakeDispatch = {
        flowChanged: sinon.spy()
      };

      sinon.stub(d3, 'dispatch').returns(FakeDispatch);

      var selectStub = sinon.stub().returns({
        call: sinon.spy()
      });

      var FakeNodeElement = {
        call: sinon.spy(),
        on: sinon.spy(),
        select: selectStub
      };

      var renderStub = sinon.stub().returns(FakeNodeElement);

      FakeFlowNodeRenderer = {
        render: renderStub,
        on: sinon.spy()
      };

      $provide.value('FlowNodeRenderer', FakeFlowNodeRenderer);

      FakeFlowLinkRenderer = {
        render: sinon.spy()
      };

      $provide.value('FlowLinkRenderer', FakeFlowLinkRenderer);

    });
  });

  afterEach(function(){
    d3.dispatch.restore();
  });

  describe('when flow has two nodes', function() {
    var node1, node2, link1, link2, link3;

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
      expect(FakeFlowNodeRenderer.render).to.have.been.calledWith(renderScope, node1);
      expect(FakeFlowNodeRenderer.render).to.have.been.calledWith(renderScope, node2);
    });

    it('should call render on FlowLinkRenderer', function () {
      expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link1, flow.nodes);
      expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link2, flow.nodes);
      expect(FakeFlowLinkRenderer.render).to.have.been.calledWith(renderScope, link3, flow.nodes);
    });
  });
});