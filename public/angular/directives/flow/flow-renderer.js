angular.module('octobluApp')
.service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, FlowNodeDimensions) {
  var VIEWBOX_X = 0, VIEWBOX_Y=0, VIEWBOX_WIDTH=1000, VIEWBOX_HEIGHT=1000;

  return function (element, options) {
    var snap = Snap(".flow-editor-workspace");
    snap.transformCoords = function(x, y){
      var transformPoint = this.node.createSVGPoint();
      transformPoint.x = x;
      transformPoint.y = y;
      transformPoint = transformPoint.matrixTransform(this.node.getScreenCTM().inverse());
      return {x: transformPoint.x, y: transformPoint.y};
    };

    // snap.attr(
    //   {
    //     'shape-rendering': 'auto',
    //     'color-rendering': 'optimizeQuality',
    //     'image-rendering': 'optimizeQuality',
    //     'text-rendering' : 'optimizeLegibility'
    //   }
    // );

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
      unselectAll();
      dispatch.nodeSelected(null);
      dispatch.linkSelected(null);
    });

    function unselectAll() {
      _.each(snap.selectAll(".selected"),function(selected){
        selected.toggleClass('selected',false);
      });
    }

    function select(nodeElement) {
      unselectAll();
      nodeElement.toggleClass('selected',true);
    }

    function selectCallback(nodeElement, callback) {
      return function(node) {
        select(nodeElement);
        callback(node);
      }
    }

    function addClickBehavior(nodeElement, node, callback) {
      if (!nodeElement) { return; }

      nodeElement.click(function (event) {
        //console.log("selectClicked!");
        if (!event || event.defaultPrevented) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        callback(node);
      });

      nodeElement.dblclick(function(event){
        event.preventDefault();
        event.stopPropagation();
      });
    }

    function addDragBehavior(draggedElement, node, flow) {
      draggedElement.drag(
        function (dx,dy,ex,ey,event) {
          //console.log("renderer onMove", arguments);
          if(!event){return};
          event.stopPropagation();
          event.preventDefault();
          var to = snap.transformCoords(ex,ey);
          node.x = to.x - (FlowNodeDimensions.width / 2);
          node.y = to.y - (FlowNodeDimensions.minHeight / 2);
          draggedElement.attr({"transform": "translate(" + node.x + "," + node.y + ")"});
          var linkedTo   = _.find(flow.links, {to:node.id});
          var linkedFrom = _.find(flow.links, {from:node.id});
          //console.log("links:",linkedTo,linkedFrom);
          renderNodeLinks(node,flow);
          //renderLinks(flow);
        },
        function (x,y,event) {
          //console.log("renderer onDragStart:", arguments);
          if(!event){return};
          currentlyDragging = true;
          event.stopPropagation();
          event.preventDefault();
          select(draggedElement);
        },
        function (event) {
          //console.log("renderer onDragEnd", arguments);
          if(!event){return};
          currentlyDragging = false;
        });
    }

    function addZoomBehaviour(){
      var zoomBehavior = d3.behavior.zoom()
        .scaleExtent([0.25, 2])
        .on('zoom', function(){
          updateFlowZoomLevel(flow);
        }).on('zoomstart', function(){
          snap.select("g").toggleClass('grabby-hand', true);
        }).on('zoomend', function(){
          snap.select("g").toggleClass('grabby-hand', false);
        });
      //renderScope.call(zoomBehavior);
    }

    if (!displayOnly) {
      addZoomBehaviour();
    }

    function renderLinks(flow) {
      snap.selectAll('.flow-link').remove();
      _.each(flow.links, function (link) {
        var linkElement = FlowLinkRenderer.render(snap, link, flow);
        if (linkElement && !readonly) {
          addClickBehavior(linkElement, link, selectCallback(linkElement, dispatch.linkSelected));
        }
      });
    }

    function renderNodeLinks(node,flow) {
      snap.selectAll('.flow-link-to-'+node.id).remove();
      snap.selectAll('.flow-link-from-'+node.id).remove();
      var processLinks = function(links) {
        _.each(links, function (link) {
          //console.log('processingLink:',link);
          var linkElement = FlowLinkRenderer.render(snap, link, flow);
          if (linkElement && !readonly) {
            addClickBehavior(linkElement, link, selectCallback(linkElement, dispatch.linkSelected));
          }
        });
      };
      processLinks(_.where(flow.links,{to:node.id}));
      processLinks(_.where(flow.links,{from:node.id}));
    }

    function renderNodes(flow) {
      snap.selectAll('.flow-node').remove();
      _.each(flow.nodes, function (node) {
        var nodeElement = FlowNodeRenderer.render(snap, node, flow);
        if(readonly){
          return;
        }
        addDragBehavior(nodeElement, node, flow);
        addClickBehavior(nodeElement, node, selectCallback(nodeElement, dispatch.nodeSelected));
        addClickBehavior(snap.select('#node-button-'+node.id), node, dispatch.nodeButtonClicked);
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
/*
      snap.selectAll('.flow-background-overlay').remove();
      snap.select("g").append(snap.rect()
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .attr('x', leftEdge)
        .attr('y', topEdge)
        .toggleClass('flow-background-overlay', true));
        */
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

    (function () {
      var editorArea = snap.select('.flow-editor-render-area');
      if (!editorArea) {
        editorArea = snap.group().toggleClass('flow-editor-render-area', true);
        snap.append(editorArea);
      }
      var linkArea = snap.select('.flow-link-area');
      if (!linkArea) {
        linkArea = snap.group().toggleClass('flow-link-area', true);
        editorArea.append(linkArea);
      }
    })();

    var currentlyDragging = false;

    snap.touchstart(function() {
      console.log('touchStart:',arguments);
    });
    snap.touchmove(function() {
      console.log('touchMove:',arguments);
    });
    snap.touchend(function() {
      console.log('touchEnd:',arguments);
    });

    function addWheelBehavior(nodeElement, flow) {
      nodeElement.addEventListener('mousewheel', function(event) {
        if(!event){return};
        event.stopPropagation();
        event.preventDefault();
        var scaleChange = 1-(event.deltaY/event.screenY);
        //console.log('wheel:', direction, event.deltaY, scaleChange, event);
        flow.zoomScale *= scaleChange;
        updateZoomScale(flow.zoomScale);
      });
    }
    snap.node.addEventListener('scroll', function(event) {
      console.log('scroll:',event);
    });

    function updateViewBox(x,y,w,h) {
        snap.attr({'viewBox': [x, y, w, h].join(' ')});
    }

    function updateZoomScale(scale) {
      var w = VIEWBOX_WIDTH  / scale;
      var h = VIEWBOX_HEIGHT / scale;
      var x = VIEWBOX_X - (w - VIEWBOX_WIDTH)/2;
      var y = VIEWBOX_Y - (h - VIEWBOX_HEIGHT)/2;
      updateViewBox(x,y,w,h);
    }

    function addPanBehavior(dragElement, flow) {
      dragElement.addEventListener('dragstart', function(event){
        event.preventDefault();

        var startViewboxX = VIEWBOX_X;
        var startViewboxY = VIEWBOX_Y;
        var originalX = event.clientX;
        var originalY = event.clientY;

        snap.toggleClass('grabby-hand',true);

        function dragging(event){
          var startPos    = snap.transformCoords(originalX, originalY);
          var currentPos  = snap.transformCoords(event.clientX, event.clientY);
          var differenceX = currentPos.x - startPos.x;
          var differenceY = currentPos.y - startPos.y;
          VIEWBOX_X = startViewboxX - differenceX;
          VIEWBOX_Y = startViewboxY - differenceY;
          updateZoomScale(flow.zoomScale);
        }

        var throttleDragging = _.throttle(dragging,30);

        function dropped(event) {
          dragElement.removeEventListener('mousemove', throttleDragging);
          dragElement.removeEventListener('mouseup', dropped);
          snap.toggleClass('grabby-hand',false);
        }

        dragElement.addEventListener('mousemove', throttleDragging);
        dragElement.addEventListener('mouseup', dropped);
      });
    }

    return {

      centerOnSelectedFlowNode: function(flow){
        var width = ($(window).width()/flow.zoomScale)/2;
        var height = ($(window).height()/flow.zoomScale)/2;

        flow.zoomX = -flow.selectedFlowNode.x + width;
        flow.zoomY = -flow.selectedFlowNode.y + height;
      },
      render: function(flow) {
        if (currentlyDragging) {
          return;
        }
        console.log("rendering!");
        addPanBehavior(snap.node,flow);
        addWheelBehavior(snap.node,flow);
        renderLinks(flow);
        renderNodes(flow);
        zoom(flow);
      },
      renderGrid: renderBackground,
      on: function(event, callback) {
        return dispatch.on(event, callback);
      },
      updateZoomScale: updateZoomScale
    };
  };
});
