angular.module('octobluApp')
  .service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, FlowNodeDimensions) {
    return function (renderScope) {

      var dispatch = d3.dispatch('flowChanged', 'nodeSelected');

      renderScope.on('click', function () {
        if (d3.event.defaultPrevented) {
          return;
        }
        dispatch.nodeSelected(null);
      });

      function addClickBehavior(nodeElement, node) {
        nodeElement.on('click', function () {
          if (d3.event.defaultPrevented) {
            return;
          }
          d3.event.preventDefault();
          dispatch.nodeSelected(node);
        });
      }

      function addDragBehavior(nodeElement, node, flow) {
        var dragBehavior = d3.behavior.drag()
          .on('dragstart', function () {
            d3.event.sourceEvent.stopPropagation();
          })
          .on('drag', function () {
            node.x = d3.event.x - (FlowNodeDimensions.width / 2);
            node.y = d3.event.y - (FlowNodeDimensions.height / 2);
            d3.select(this)
              .attr("transform", "translate(" + node.x + "," + node.y + ")");
            renderLinks(flow);
          })
          .on('dragend', function () {
            dispatch.flowChanged(flow);
          });

        nodeElement.call(dragBehavior);
      }

      function renderLinks(flow) {
        renderScope.selectAll('.flow-link').remove();
        _.each(flow.links, function (link) {
          FlowLinkRenderer.render(renderScope, link, flow.nodes);
        });
      }

      function renderNodes(flow) {
        renderScope.selectAll('.flow-node').remove();
        _.each(flow.nodes, function (node) {
          var nodeElement = FlowNodeRenderer.render(renderScope, node);
          addDragBehavior(nodeElement, node, flow);
          addClickBehavior(nodeElement, node);
        });
      }

      return {
        render: function (flow) {
          renderNodes(flow);
          renderLinks(flow);
        },
        on: function (event, callback) {
          return dispatch.on(event, callback);
        }
      };
    };
  });
