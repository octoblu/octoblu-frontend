angular.module('octobluApp')
.service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, FlowNodeDimensions) {

  return function (element, options) {
    var snap = Snap(".flow-editor-workspace");
    /*
    snap.attr(
      {
        'shape-rendering': 'auto',
        'color-rendering': 'optimizeQuality',
        'image-rendering': 'optimizeQuality',
        'text-rendering' : 'optimizeLegibility'
      }
    );
*/

    var renderScope = d3.select(element.find('.flow-editor-render-area')[0]);
    var dispatch = d3.dispatch('flowChanged', 'nodeSelected', 'linkSelected', 'nodeButtonClicked');
    var readonly = options && options.readonly;
    var displayOnly = options && options.displayOnly;
    if (displayOnly) {
      readonly = true;
    }

    renderScope.on('click', function () {
      if (d3.event.defaultPrevented) {
        return;
      }
      dispatch.nodeSelected(null);
      dispatch.linkSelected(null);
    });

    function addNodeClickBehavior(nodeElement, node, flow) {
      var nodeClicked = function () {
        if (d3.event.defaultPrevented) {
          return;
        }
        d3.event.preventDefault();
        d3.event.stopPropagation();
        dispatch.nodeSelected(node);
      };
      /*
      nodeElement.on('click', nodeClicked);
      nodeElement.on('dblclick', function(){
        d3.event.preventDefault();
        d3.event.stopPropagation();
      });
      */
    }

    function addButtonClickBehavior(nodeElement, node) {
      if (node.type === 'operation:trigger') {
        var buttonClicked = function () {
          d3.event.preventDefault();
          d3.event.stopPropagation();
          dispatch.nodeButtonClicked(node);
        };
        nodeElement.on('click', buttonClicked);
      }
      nodeElement.on('dblclick', function(){
        d3.event.preventDefault();
        d3.event.stopPropagation();
      });
    }

    function addLinkClickBehavior(linkElement, link, flow) {
      var linkClicked = function () {
        if (d3.event.defaultPrevented) {
          return;
        }
        d3.event.preventDefault();
        dispatch.linkSelected(link);
      };
      linkElement.on('touchstart', function(){
        linkClicked();
        clearTimeout(link.touchTimer);
        link.touchTimer = setTimeout(function(){
          dispatch.linkSelected(null);
          _.pull(flow.links, link);
        }, 1200);
      });
      linkElement.on('click', linkClicked);
      linkElement.on('touchend', function(){
        clearTimeout(link.touchTimer);
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
          dispatch.nodeSelected(node);
        })
        .on('drag', function () {
          node.x = d3.event.x - (FlowNodeDimensions.width / 2);
          node.y = d3.event.y - (FlowNodeDimensions.minHeight / 2);
          d3.select(this)
            .attr("transform", "translate(" + node.x + "," + node.y + ")");
          renderLinks(flow);
        })
        .on('dragend', function () {});

      //draggedElement.call(dragBehavior);
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
        if (linkElement && !readonly) {
          addLinkClickBehavior(linkElement, link, flow);
        }
      });
    }

    function renderNodes(flow) {
      console.log("callingRenderNodes!");
      snap.selectAll('.flow-node').remove();
      //snap.selectAll('.flow-node-button').remove();
      _.each(flow.nodes, function (node) {
        var nodeElement = FlowNodeRenderer.render(snap, renderScope, node, flow);
        if(readonly){
          return;
        }
        //addDragBehavior(nodeElement, node, flow);
        //addNodeClickBehavior(nodeElement, node, flow);
        //var button = renderScope.select('#node-button-' + node.id);
        //addButtonClickBehavior(button, node);
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
      // renderScope.attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ")");
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

    var lastFlow = {};

    return {

      centerOnSelectedFlowNode: function(flow){
        var width = ($(window).width()/flow.zoomScale)/2;
        var height = ($(window).height()/flow.zoomScale)/2;

        flow.zoomX = -flow.selectedFlowNode.x + width;
        flow.zoomY = -flow.selectedFlowNode.y + height;
      },
      render: function (flow) {

        // Create a copy and check for changes that don't involve
        // zoomX, zoomY, zoomScale... we don't care about those
        // there is probably a better way
        var newFlow = _.cloneDeep(flow);
        delete newFlow.zoomX;
        delete newFlow.zoomY;
        delete newFlow.zoomScale;
        if (_.isEqual(newFlow, lastFlow)) {
          return;
        }
        lastFlow = newFlow;

        // Adding zoom behavior deals with changes in flow.zoom*
        if (!displayOnly) {
          addZoomBehaviour(flow);
        }
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
