angular.module('octobluApp')
  .service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, FlowNodeDimensions) {
    return function (renderScope) {

      var dispatch = d3.dispatch('flowChanged', 'nodeSelected', 'linkSelected');

      var clearSelection = function () {
        renderScope.selectAll('.selected').classed('selected', false);
      };
      renderScope.on('click', function () {
        if (d3.event.defaultPrevented) {
          return;
        }
        clearSelection();
        dispatch.nodeSelected(null);
      });

      function addNodeClickBehavior(nodeElement, node) {
        nodeElement.on('click', function () {
          if (d3.event.defaultPrevented) {
            return;
          }
          d3.event.preventDefault();
          clearSelection();
          nodeElement.classed('selected', true);
          dispatch.nodeSelected(node);
        });
      }

      function addLinkClickBehavior(linkElement, link) {
        linkElement.on('click', function () {
          if (d3.event.defaultPrevented) {
            return;
          }
          d3.event.preventDefault();
          clearSelection();
          linkElement.classed('selected', true);
          dispatch.linkSelected(link);
        });
      }

      function addDragBehavior(draggedElement, node, flow) {
        var dragBehavior = d3.behavior.drag()
          .on('dragstart', function () {
            d3.event.sourceEvent.stopPropagation();
          })
          .on('drag', function () {
            node.x = d3.event.x - (FlowNodeDimensions.width / 2);
            node.y = d3.event.y - (FlowNodeDimensions.minHeight / 2);
            d3.select(this)
              .attr("transform", "translate(" + node.x + "," + node.y + ")");
            renderLinks(flow);
          })
          .on('dragend', function () {});

        draggedElement.call(dragBehavior);
      }

      function addZoomBehaviour(flow){
        var zoomBehavior = d3.behavior.zoom()
          .scale(flow.zoomScale)
          .translate([flow.zoomCenterX, flow.zoomCenterY])
          .scaleExtent([0.25, 2])
          .on('zoom', function(){
            updateFlowZoomLevel(flow);
          });
        renderScope.call(zoomBehavior);
      }

      function renderLinks(flow) {
        renderScope.selectAll('.flow-link').remove();
        _.each(flow.links, function (link) {
          var linkElement = FlowLinkRenderer.render(renderScope, link, flow.nodes);
          if (linkElement) {
            addLinkClickBehavior(linkElement, link);
          }
        });
      }

      function renderNodes(flow) {
        renderScope.selectAll('.flow-node').remove();
        _.each(flow.nodes, function (node) {
          var nodeElement = FlowNodeRenderer.render(renderScope, node, flow);
          addDragBehavior(nodeElement, node, flow);
          addNodeClickBehavior(nodeElement, node);
        });
      }

      function updateFlowZoomLevel(flow) {
        flow.zoomCenterX = d3.event.translate[0];
        flow.zoomCenterY = d3.event.translate[1];
        flow.zoomScale  = d3.event.scale;
        dispatch.flowChanged(flow);
      }

      function zoom(flow) {
        var translate, scale;
        translate = [flow.zoomCenterX, flow.zoomCenterY];
        scale     = flow.zoomScale;
        renderScope.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
      }

      return {
        render: function (flow) {
          addZoomBehaviour(flow);
          renderNodes(flow);
          renderLinks(flow);
          zoom(flow);
        },
        on: function (event, callback) {
          return dispatch.on(event, callback);
        }
      };
    };
  });
