angular.module('octobluApp')
  .service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer) {
    return function (renderScope) {
      var dispatch = d3.dispatch('flowChanged', 'nodeSelected');
      var nodeRenderer = FlowNodeRenderer(renderScope);

      renderScope.on('click', function () {
        if (d3.event.defaultPrevented) {
          return;
        }
        dispatch.nodeSelected(null);
      });

      function renderLinks(flow) {
        renderScope.selectAll('.flow-link').remove();
        _.each(flow.links, function(link){
          FlowLinkRenderer.render(renderScope, link, flow.nodes);
        });
      }

      return {
        render: function (flow) {
          nodeRenderer.render(flow.nodes);
          renderLinks(flow);

          nodeRenderer
            .on('nodeMoved', function (flowNode) {
              renderLinks(flow);
            });

          nodeRenderer
            .on('nodeChanged', function (flowNode) {
              dispatch.flowChanged(flow);
            });

          nodeRenderer
            .on('nodeClicked', function (flowNode) {
              dispatch.nodeSelected(flowNode);
            });
        },
        clear: function () {
          nodeRenderer.clear();
        },
        on: function (event, callback) {
          return dispatch.on(event, callback);
        }
      };
    };
  });
