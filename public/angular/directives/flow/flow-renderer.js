angular.module('octobluApp')
  .service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, FlowNodeDimensions) {
    return function (renderScope) {
      var dispatch = d3.dispatch('flowChanged', 'nodeSelected', 'linkSelected', 'nodeButtonClicked');

      renderScope.on('click', function () {
        if (d3.event.defaultPrevented) {
          return;
        }
        dispatch.nodeSelected(null);
        dispatch.linkSelected(null);
      });

      function addNodeClickBehavior(nodeElement, node) {
        nodeElement.on('click', function () {
          if (d3.event.defaultPrevented) {
            return;
          }
          d3.event.preventDefault();
          dispatch.nodeSelected(node);
        });
        nodeElement.on('dblclick', function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });
      }

      function addButtonClickBehavior(nodeElement, node) {
        if (node.category == 'button') {
          nodeElement.selectAll('.flow-node-button').on('click', function () {
            dispatch.nodeButtonClicked(node);
          });
        }
        nodeElement.on('dblclick', function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
        });
      }

      function addLinkClickBehavior(linkElement, link) {
        linkElement.on('click', function () {
          if (d3.event.defaultPrevented) {
            return;
          }
          d3.event.preventDefault();
          dispatch.linkSelected(link);
        });
        linkElement.on('dblclick', function(){
          d3.event.preventDefault();
          d3.event.stopPropagation();
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
          .scaleExtent([0.25, 2])
          .on('zoom', function(){
            updateFlowZoomLevel(flow);
          }).on('zoomstart', function(){
            renderScope.classed('grabby-hand', true);
          }).on('zoomend', function(){
            renderScope.classed('grabby-hand', false);
          });
        renderScope.call(zoomBehavior);
      }

      function renderLinks(flow) {
        renderScope.selectAll('.flow-link').remove();
        _.each(flow.links, function (link) {
          var linkElement = FlowLinkRenderer.render(renderScope, link, flow);
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
          addButtonClickBehavior(nodeElement, node);
        });
      }

      function updateFlowZoomLevel(flow) {
        flow.zoomScale  *= d3.event.scale;
        flow.zoomX  += (d3.event.translate[0] * flow.zoomScale);
        flow.zoomY  += (d3.event.translate[1] * flow.zoomScale);

        var scale, x, y;
        scale = flow.zoomScale;
        x     = flow.zoomX || 0;
        y     = flow.zoomY || 0;
        dispatch.flowChanged(flow);
      }

      function zoom(flow) {
        var scale, x, y;
        scale = flow.zoomScale;
        x     = flow.zoomX || 0;
        y     = flow.zoomY || 0;
        renderScope.attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ")");
      }

      function renderBackground() {
        var width =  5000000;
        var height = 5000000;
        var leftEdge = 0 - (width / 2);
        var rightEdge = 0 + (width / 2);
        var topEdge   = 0 - (height / 2);
        var bottomEdge   = 0 + (height / 2);

        renderScope.append('rect')
          .attr('class', 'overlay')
          .attr('width', width)
          .attr('height', height)
          .attr('x', leftEdge)
          .attr('y', topEdge);
      }

      return {
        centerOnSelectedFlowNode: function(flow){
          var width = ($(window).width()/flow.zoomScale)/2;
          var height = ($(window).height()/flow.zoomScale)/2;

          flow.zoomX = -flow.selectedFlowNode.x + width;
          flow.zoomY = -flow.selectedFlowNode.y + height;
        },
        render: function (flow) {
          addZoomBehaviour(flow);
          renderNodes(flow);
          renderLinks(flow);
          zoom(flow);
        },
        renderGrid: renderBackground,
        on: function (event, callback) {
          return dispatch.on(event, callback);
        }
      };
    };
  });
