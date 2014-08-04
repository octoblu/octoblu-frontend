angular.module('octobluApp')
    .service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer) {
        return function (renderScope) {
            var dispatch = d3.dispatch('flowChanged');
            var linkRenderer = new FlowLinkRenderer(renderScope),
                nodeRenderer = new FlowNodeRenderer(renderScope);
            this.render = function (flow) {
                nodeRenderer.render(flow.nodes)
                    .on('nodeMoved', function (flowNode) {
                        linkRenderer.updateLinksContaining(flowNode);
                    })
                    .on('nodeChanged', function (flowNode) {
                        dispatch.flowChanged(flow);
                    });
                linkRenderer.render(flow.links);
                return dispatch;
            };
            this.clear = function () {
                nodeRenderer.clear();
                linkRenderer.clear();
            }
        };
    });
