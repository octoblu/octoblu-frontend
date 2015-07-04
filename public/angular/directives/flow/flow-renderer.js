angular.module('octobluApp')
.service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, FlowNodeDimensions) {
  var
    VIEWBOX_DEFAULT_X=0,
    VIEWBOX_DEFAULT_Y=0,
    VIEWBOX_DEFAULT_W=1000,
    VIEWBOX_DEFAULT_H=1000;

  var objDiff = function(newObj, oldObj) {
    var modObj = _.clone(newObj);
    if (!oldObj) return modObj;
    var objDiff = _.pick(modObj,function(value,key){
      return !_.isEqual(value,oldObj[key]);
    });
    return objDiff;
  }

  return function (snap, context, options) {
    var
      vbOrigX = VIEWBOX_DEFAULT_X,
      vbOrigY = VIEWBOX_DEFAULT_Y,
      vbOrigW = VIEWBOX_DEFAULT_W,
      vbOrigH = VIEWBOX_DEFAULT_H,
      viewBoxX = vbOrigX,
      viewBoxY = vbOrigY,
      viewBoxW = vbOrigW,
      viewBoxH = vbOrigH;

    var nodeMap, linkMap;
    var lastNodes, lastLinks;

    //var snap = Snap(".flow-editor-workspace");
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
        console.log("selectClicked!");
        if (!event || event.defaultPrevented) {
          console.log("selectClicked aborted");
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (callback) {
          callback(node);
        }
      });

      nodeElement.dblclick(function(event){
        event.preventDefault();
        event.stopPropagation();
      });
    }

    function addDragBehavior(dragGroup, dragItem, node, flow) {
      var moveInfo;
      var MIN_DIFF = 5;
      function minDiff(event) {
        if (!moveInfo) { return false; }
        if (moveInfo.pass) { return true; }
        var dX = Math.abs(moveInfo.origX-event.clientX);
        var dY = Math.abs(moveInfo.origY-event.clientY);
        return moveInfo.pass = (dX>MIN_DIFF || dY>MIN_DIFF);
      }

      var throttleNodeDrag = _.throttle(
        function(x,y) {
          updateLinks(node.id,moveInfo,{x:x,y:y});
          dragGroup.attr({"transform":"translate("+x+","+y+")"});
        },30);

      dragItem.drag(
        function (dx,dy,ex,ey,event) {
          //console.log("renderer onMove", arguments);
          if(!event){return};
          event.stopPropagation();
          event.preventDefault();
          if (!minDiff(event)){return;}
          var to = snap.transformCoords(event.clientX,event.clientY);
          var newX = to.x - (FlowNodeDimensions.width / 2);
          var newY = to.y - (FlowNodeDimensions.minHeight / 2);
          throttleNodeDrag(newX,newY);
        },
        function (x,y,event) {
          //console.log("renderer onDragStart:", arguments);
          if(!event){return};
          event.stopPropagation();
          event.preventDefault();
          moveInfo = {
            origX: event.clientX,
            origY: event.clientY,
            toLinks  : _.where(flow.links,{to:node.id}),
            fromLinks: _.where(flow.links,{from:node.id})
          };
          dispatch.nodeSelected(node);
          select(dragGroup);
          setTimeout(function(){
            console.log('inTimeout!');
            node.x = 0;
            node.y = 0;
          },1000);
        },
        function (event) {
          //console.log("renderer onDragEnd", arguments);
          if(!event){return};
          if(!minDiff(event)){return;}
          event.stopPropagation();
          event.preventDefault();
          //console.log("saving node change...");
          var to = snap.transformCoords(event.clientX,event.clientY);
          node.x = to.x - (FlowNodeDimensions.width / 2);
          node.y = to.y - (FlowNodeDimensions.minHeight / 2);
          updateLinks(node.id,moveInfo,{x:node.x,y:node.y});
          dragGroup.attr({"transform":"translate("+node.x+","+node.y+")"});
        });
    }

    if (!displayOnly) {
      //addZoomBehaviour();
    }

    // function renderLinks(flow) {
    //   snap.selectAll('.flow-link').remove();
    //   _.each(flow.links, function (link) {
    //     var linkElement = FlowLinkRenderer.render(snap, link, flow);
    //     if (linkElement && !readonly) {
    //       addClickBehavior(linkElement, link, selectCallback(linkElement, dispatch.linkSelected));
    //     }
    //   });
    // }

    function renderLinks(newLinksDiff, oldLinksDiff) {
      _.each(newLinksDiff, function (link, linkId) {
        if (!oldLinksDiff[linkId]) {
          snap.selectAll('#link-'+linkId).remove();
          var linkElement = FlowLinkRenderer.render(snap, link, context.flow);
          if (linkElement && !readonly) {
            addClickBehavior(linkElement, link, selectCallback(linkElement, dispatch.linkSelected));
          }
        }
      });
      _.each(oldLinksDiff, function (link, linkId) {
        if (!newLinksDiff[linkId]) {
          snap.selectAll('#link-'+linkId).remove();
        }
      });
    }

    function updateLinks(nodeId,info,pos) {
      snap.selectAll('.flow-link-to-'+nodeId).remove();
      snap.selectAll('.flow-link-from-'+nodeId).remove();
      var processLinks = function(links, loc) {
        _.each(links, function (link) {
          var linkElement = FlowLinkRenderer.render(snap, link, context.flow, loc);
          if (linkElement && !readonly) {
            addClickBehavior(linkElement, link, selectCallback(linkElement, dispatch.linkSelected));
          }
        });
      };
      info = info || {};
      var toLinks = info.toLinks || _.where(context.flow.links,{to:nodeId});
      var fromLinks = info.fromLinks || _.where(context.flow.links,{from:nodeId});
      processLinks(toLinks,{to:pos});
      processLinks(fromLinks,{from:pos});
    }

    function renderNodes(newNodesDiff, oldNodesDiff) {
      //snap.selectAll('.flow-node').remove();
      _.each(newNodesDiff, function (node) {
        if (!oldNodesDiff[node.id]) {
          var nodeElement = FlowNodeRenderer.render(snap, node, context.flow);
          if(readonly){
            return;
          }
          var nodeImage = nodeElement.select("image");
          addDragBehavior(nodeElement, nodeImage, node, context.flow);
          addClickBehavior(nodeImage, node);
          addClickBehavior(snap.select('#node-button-'+node.id), node, dispatch.nodeButtonClicked);
        } else {
          console.log('translating...');
          updateLinks(node.id);
          snap.select('#node-'+node.id).attr({"transform":"translate("+node.x+","+node.y+")"});
        }
      });
      _.each(oldNodesDiff, function (node) {
        if (!newNodesDiff[node.id]) {
          console.log('removing...',snap.selectAll('#flow-node-'+node.id));
          snap.selectAll('#node-'+node.id).remove();
          snap.selectAll('.flow-link-to-'+node.id).remove();
          snap.selectAll('.flow-link-from-'+node.id).remove();
        }
      });
    }

    function renderBackground() {
      var width =  5000000;
      var height = 5000000;
      var leftEdge = 0 - (width / 2);
      var rightEdge = 0 + (width / 2);
      var topEdge   = 0 - (height / 2);
      var bottomEdge   = 0 + (height / 2);

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

    snap.touchstart(function() {
      console.log('touchStart:',arguments);
    });
    snap.touchmove(function() {
      console.log('touchMove:',arguments);
    });
    snap.touchend(function() {
      console.log('touchEnd:',arguments);
    });

    function addZoomBehavior(nodeElement, context) {
      nodeElement.addEventListener('mousewheel', function(event) {
        if(!event){return};
        event.stopPropagation();
        event.preventDefault();
        var scaleChange = 1+(event.deltaY/event.screenY);
        //console.log('wheel:', direction, event.deltaY, scaleChange, event);
        var newW = viewBoxW * scaleChange;
        var newH = viewBoxH * scaleChange;
        var newX = viewBoxX - (newW - viewBoxW)/2;
        var newY = viewBoxY - (newH - viewBoxH)/2;

        updateViewBox(newX,newY,newW,newH);
        context.flow.zoomScale = vbOrigW/newW;
      });
    }
    snap.node.addEventListener('scroll', function(event) {
      console.log('scroll:',event);
    });

    function updateViewBox(x,y,w,h) {
      //console.log('setting viewbox to',x,y,w,h);
      viewBoxX = x;
      viewBoxY = y;
      viewBoxW = w;
      viewBoxH = h;
      snap.attr({'viewBox': [x,y,w,h].join(' ')});
    }

    function updateZoomScale(scale) {
      console.log("setting scale to ",scale);
      scale = scale || 1;
      var w = vbOrigW / scale;
      var h = vbOrigH / scale;
      var x = viewBoxX - (w-viewBoxW)/2;
      var y = viewBoxY - (h-viewBoxH)/2;
      updateViewBox(x,y,w,h);
    }

    function centerViewBox() {
      var vb = snap.select('.flow-editor-render-area').getBBox();
      vbOrigX = vb.x - 50;
      vbOrigY = vb.y - 50;
      vbOrigW = vb.width + 200;
      vbOrigH = vb.height + 200;
      updateViewBox(vbOrigX,vbOrigY,vbOrigW,vbOrigH);
      context.flow.zoomScale = 1;
    }

    function addPanBehavior(dragElement, context) {
      dragElement.addEventListener('dragstart', function(event){
        event.preventDefault();

        var startViewboxX = viewBoxX;
        var startViewboxY = viewBoxY;
        var originalX = event.clientX;
        var originalY = event.clientY;

        snap.toggleClass('grabby-hand',true);

        function dragging(event){
          var startPos    = snap.transformCoords(originalX, originalY);
          var currentPos  = snap.transformCoords(event.clientX, event.clientY);
          var differenceX = currentPos.x - startPos.x;
          var differenceY = currentPos.y - startPos.y;
          var newX = startViewboxX - differenceX;
          var newY = startViewboxY - differenceY;
          updateViewBox(newX, newY, viewBoxW, viewBoxH);
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

    //var context = {flow:{}};

    addPanBehavior(snap.node,context);
    addZoomBehavior(snap.node,context);

    return {

      centerOnSelectedFlowNode: function(flow){
        var width = ($(window).width()/flow.zoomScale)/2;
        var height = ($(window).height()/flow.zoomScale)/2;

        flow.zoomX = -flow.selectedFlowNode.x + width;
        flow.zoomY = -flow.selectedFlowNode.y + height;
      },
      render: function() {
        // WARNING: don't add listeners here!
        if (!context.flow) { return; }
        console.log("rendering!");
        //context.flow = flow;
        if (!snap.attr('viewBox')){
          updateViewBox(vbOrigX,vbOrigY,vbOrigH,vbOrigW);
          context.flow.zoomScale = 1;
        }
        var newNodeMap = _.indexBy(context.flow.nodes,'id');
        var newLinkMap = _.indexBy(context.flow.links,function(link){
          return 'from-'+link.from + "-to-" + link.to;
        });

        var newNodesDiff = objDiff(newNodeMap,lastNodes);
        var newLinksDiff = objDiff(newLinkMap,lastLinks);
        var oldNodesDiff = objDiff(lastNodes,newNodeMap);
        var oldLinksDiff = objDiff(lastLinks,newLinkMap);
        console.log('newNodesDiff:',newNodesDiff);
        console.log('newLinksDiff:',newLinksDiff);
        console.log('oldNodesDiff:',oldNodesDiff);
        console.log('oldLinksDiff:',oldLinksDiff);
        lastNodes = _.cloneDeep(newNodeMap);
        lastLinks = _.cloneDeep(newLinkMap);
        nodeMap = newNodeMap;
        linkMap = newLinkMap;


        //renderLinks(context.flow);
        renderLinks(newLinksDiff,oldLinksDiff);
        renderNodes(newNodesDiff,oldNodesDiff);
        //renderNodes(context.flow);
        //zoom(flow);
      },
      renderGrid: renderBackground,
      on: function(event, callback) {
        return dispatch.on(event, callback);
      },
      updateViewBox: updateViewBox,
      updateZoomScale: updateZoomScale,
      centerViewBox: centerViewBox
    };
  };
});
