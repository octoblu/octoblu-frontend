angular.module('octobluApp')
.service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, FlowNodeDimensions) {

  return function (element, options) {
    var snap = Snap(".flow-editor-workspace");
    snap.transformCoords = function(x, y){
      var transformPoint = this.node.createSVGPoint();
      transformPoint.x = x;
      transformPoint.y = y;
      transformPoint = transformPoint.matrixTransform(this.node.getScreenCTM().inverse());
      return {x: transformPoint.x, y: transformPoint.y};
    };

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

    //var renderScope = d3.select(element.find('.flow-editor-render-area')[0]);
    var readonly = options && options.readonly;
    var displayOnly = options && options.displayOnly;
    if (displayOnly) {
      readonly = true;
    }

    snap.click(function(event){
      //console.log('backgroundClicked!');
      if (!event || event.defaultPrevented) {
        return;
      }
      _.each(snap.selectAll(".selected"),function(selected){
        selected.toggleClass('selected',false);
      });
      dispatch.nodeSelected(null);
      dispatch.linkSelected(null);
    });

    function addSelectClickBehavior(nodeElement, node, flow, selectCallback) {
      nodeElement.click(function (event) {
        //console.log("selectClicked!");
        if (!event || event.defaultPrevented) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        _.each(snap.selectAll(".selected"),function(selected){
          selected.toggleClass('selected',false);
        });
        nodeElement.toggleClass('selected',true);
        selectCallback(node);
      });
      nodeElement.dblclick(function(event){
        event.preventDefault();
        event.stopPropagation();
      });
    }

    function addButtonClickBehavior(nodeElement, node, buttonCallback) {
      if (!nodeElement || node.type !== 'operation:trigger') {
        return;
      }
      nodeElement.click(function(event) {
        //console.log("buttonClicked!");
        if (!event || event.defaultPrevented) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        buttonCallback(node);
      });
      nodeElement.dblclick(function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }

    function addDragBehavior(draggedElement, node, flow) {
      var dragBehavior = d3.behavior.drag()
        .on('dragstart', function () {
          d3.event.sourceEvent.stopPropagation();
          //dispatch.nodeSelected(node);
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
          //renderScope.classed('grabby-hand', true);
        }).on('zoomend', function(){
          //renderScope.classed('grabby-hand', false);
        });
      //renderScope.call(zoomBehavior);
    }

    function renderLinks(flow) {
      snap.selectAll('.flow-link').remove();
      _.each(flow.links, function (link) {
        var linkElement = FlowLinkRenderer.render(snap, link, flow);
        if (linkElement && !readonly) {
          addSelectClickBehavior(linkElement, link, flow, dispatch.linkSelected);
        }
      });
    }

    function renderNodes(flow) {
      snap.selectAll('.flow-node').remove();
      _.each(flow.nodes, function (node) {
        var nodeElement = FlowNodeRenderer.render(snap, node, flow);
        if(readonly){
          return;
        }
        //addDragBehavior(nodeElement, node, flow);
        addSelectClickBehavior(nodeElement, node, flow, dispatch.nodeSelected);
        addButtonClickBehavior(snap.select('#node-button-'+node.id), node, dispatch.nodeButtonClicked);
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
      //dispatch.flowChanged(flow);
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

      snap.selectAll('.flow-background-overlay').remove();
      snap.select("g").append(snap.rect()
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .attr('x', leftEdge)
        .attr('y', topEdge)
        .toggleClass('flow-background-overlay', true));
    }

    function Dispatch() {
      var patch = {
        on: function(name, callback) {
          return patch[name] = callback;
        }
      };
      _.each(arguments, function(name){
        patch[name] = function(){ console.log(' ! default dispatch for ', name); };
      });
      return patch;
    };
    var dispatch = Dispatch('flowChanged', 'nodeSelected', 'linkSelected', 'nodeButtonClicked');

    return {

      centerOnSelectedFlowNode: function(flow){
        var width = ($(window).width()/flow.zoomScale)/2;
        var height = ($(window).height()/flow.zoomScale)/2;

        flow.zoomX = -flow.selectedFlowNode.x + width;
        flow.zoomY = -flow.selectedFlowNode.y + height;
      },
      render: function(flow) {
        console.log("rendering!");
        if (!displayOnly) {
          addZoomBehaviour(flow);
        }
        renderLinks(flow);
        renderNodes(flow);
        zoom(flow);
      },
      renderGrid: renderBackground,
      on: function(event, callback) {
        return dispatch.on(event, callback);
      }
    };
  };
});
