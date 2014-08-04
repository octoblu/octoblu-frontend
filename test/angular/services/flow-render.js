describe('FlowService', function () {
  var sut;
  beforeEach(function () {
    module('octobluApp');

    inject(function (FlowRenderer, FakeFlowNodeRenderer, FakeFlowLinkRenderer) {
      sut = FlowRenderer;
    });

  });
});

var FakeFlowNodeRenderer = {};
var FakeFlowLinkRenderer = {};