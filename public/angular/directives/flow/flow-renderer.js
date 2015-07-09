angular.module('octobluApp')
.service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, FlowNodeDimensions, CoordinatesService) {
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
  };

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
    var nodeElements = {}, linkElements = {};

    var readonly = options && options.readonly;
    var displayOnly = options && options.displayOnly;

    if (displayOnly) {
      readonly = true;
    }

    function backgroundClicked() {
      unselectAll();
      dispatch.nodeSelected(null);
      dispatch.linkSelected(null);
    }

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
          //console.log("selectClicked aborted");
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (callback) {
          callback(node);
        }
      });

      var touchStartPos;

      nodeElement.touchstart(function(event) {
        //console.log('touched!');
        if (!event) {return;}
        event.preventDefault();
        event.stopPropagation();
        touchStartPos = getClientPos(event);
      });

      nodeElement.touchend(function(event) {
        if (!event) {return;}
        event.preventDefault();
        event.stopPropagation();
        if (!touchStartPos) {
          return;
        }
        var endPos = getClientPos(event);
        var dX = Math.abs(touchStartPos.clientX - endPos.clientX);
        var dY = Math.abs(touchStartPos.clientY - endPos.clientY);
        if (dX==0 && dY==0 && callback) {
          //console.log('click callback!');
          callback(node);
        }
      });

      nodeElement.dblclick(function(event){
        event.preventDefault();
        event.stopPropagation();
      });
    }

    function getClientPos(event) {
      var touches = event.touches;
      if (!touches || !touches.length) {
        touches = event.changedTouches;
      }
      return {
        clientX: event.clientX || touches[0].clientX,
        clientY: event.clientY || touches[0].clientY
      };
    }

    function addDragBehavior(dragGroup, dragItem, node, flow) {
      var moveInfo;
      var MIN_DIFF = 5;

      function minDiff(event) {
        var pos = getClientPos(event);
        moveInfo.clientX = pos.clientX;
        moveInfo.clientY = pos.clientY;
        if (!moveInfo) { return false; }
        if (moveInfo.pass) { return true; }
        if (!moveInfo.origX || !moveInfo.origY) { return false; }
        var dX = Math.abs(moveInfo.origX-moveInfo.clientX);
        var dY = Math.abs(moveInfo.origY-moveInfo.clientY);
        return moveInfo.pass = (dX>MIN_DIFF || dY>MIN_DIFF);
      }

      function onMove(dx,dy,ex,ey,event) {
        //console.log("renderer onMove", arguments);
        if(!event){return};
        event.stopPropagation();
        event.preventDefault();
        if (!minDiff(event)){console.log('return early!'); return;}
        var to = CoordinatesService.transform(snap.node, moveInfo.clientX, moveInfo.clientY);
        var newX = to.x - (FlowNodeDimensions.width / 2);
        var newY = to.y - (FlowNodeDimensions.minHeight / 2);
        updateLinks(node.id,moveInfo,{x:newX,y:newY});
        dragGroup.attr({"transform":"translate("+newX+","+newY+")"});
      };

      function onTouchMove(event) {
        onMove(undefined,undefined,undefined,undefined,event);
      };

      function onDragStart(x,y,event) {
        //console.log("renderer onDragStart:", arguments);
        if(!event){return};
        event.stopPropagation();
        event.preventDefault();
        var pos = getClientPos(event);
        moveInfo = {
          origX: pos.clientX,
          origY: pos.clientY,
          toLinks  : _.where(flow.links, {to:node.id}),
          fromLinks: _.where(flow.links, {from:node.id}),
        };
        dispatch.nodeSelected(node);
        select(dragGroup);
        // setTimeout(function(){
        //   console.log('inTimeout!');
        //   node.x = 0;
        //   node.y = 0;
        // },1000);
      };

      function onTouchStart(event) {
        onDragStart(undefined,undefined,event);
      };

      function onDragEnd(event) {
        //console.log("renderer onDragEnd", arguments);
        if(!event){return};
        if(!minDiff(event)){return;}
        event.stopPropagation();
        event.preventDefault();
        var to = CoordinatesService.transform(snap.node, moveInfo.clientX, moveInfo.clientY);
        node.x = to.x - (FlowNodeDimensions.width / 2);
        node.y = to.y - (FlowNodeDimensions.minHeight / 2);
        updateLinks(node.id,moveInfo,{x:node.x,y:node.y});
        dragGroup.attr({"transform":"translate("+node.x+","+node.y+")"});
      };

      dragItem.drag(onMove,onDragStart,onDragEnd);
      dragItem.touchstart(onTouchStart);
      dragItem.touchmove(onTouchMove);
      dragItem.touchend(onDragEnd);
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
          snap.selectAll('#'+linkId).remove();
          var linkElement = FlowLinkRenderer.render(snap, link, context.flow);
          if (linkElement) {
            linkElements[linkElement.attr('id')] = linkElement;
            if (!readonly){
              addClickBehavior(linkElement, link, selectCallback(linkElement, dispatch.linkSelected));
            }
          } else {
            console.log('unable to create link:',link);
            //context.flow.links = _.without(context.flow.links,link);
          }
        }
      });
      _.each(oldLinksDiff, function (link, linkId) {
        if (!newLinksDiff[linkId]) {
          delete linkElements[linkId];
          snap.selectAll('#'+linkId).remove();
        }
      });
    }

    function updateLinks(nodeId,info,pos) {
      var processLinks = function(links, loc) {
        _.each(links, function (link) {
          var linkElement = linkElements[FlowLinkRenderer.getLinkId(link)];
          if (linkElement) {
            FlowLinkRenderer.render(snap, link, context.flow, loc, linkElement);
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
        if (oldNodesDiff[node.id]) {
          updateLinks(node.id);
        }
        var nodeElement = FlowNodeRenderer.render(snap, node, context, nodeElements[node.id]);
        if (!nodeElement) {
          return;
        }
        nodeElements[node.id] = nodeElement;
        if(readonly){
          return;
        }
        var nodeImage = nodeElement.select("image");
        addDragBehavior(nodeElement, nodeImage, node, context.flow);
        addClickBehavior(nodeImage, node);
        addClickBehavior(snap.select('#node-button-'+node.id), node, dispatch.nodeButtonClicked);
      });
      _.each(oldNodesDiff, function (node) {
        if (!newNodesDiff[node.id]) {
          //console.log('removing...',snap.selectAll('#flow-node-'+node.id));
          delete nodeElements[node.id];
          snap.selectAll('#node-'+node.id).remove();
          snap.selectAll('.flow-link-to-'+node.id).remove();
          snap.selectAll('.flow-link-from-'+node.id).remove();
        }
      });
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
      var editorArea = snap.select('.flow-render-area');
      if (!editorArea) {
        editorArea = snap.group().toggleClass('flow-render-area', true);
        snap.append(editorArea);
      }
      var linkArea = snap.select('.flow-link-area');
      if (!linkArea) {
        linkArea = snap.group().toggleClass('flow-link-area', true);
        editorArea.append(linkArea);
      }
    })();

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
      //console.log("setting scale to ",scale);
      scale = scale || 1;
      var w = vbOrigW / scale;
      var h = vbOrigH / scale;
      var x = viewBoxX - (w-viewBoxW)/2;
      var y = viewBoxY - (h-viewBoxH)/2;
      updateViewBox(x,y,w,h);
    }

    function centerViewBox() {
      var vb = snap.select('.flow-render-area').getBBox();
      vbOrigX = vb.x;
      vbOrigY = vb.y;
      vbOrigW = vb.width;
      vbOrigH = vb.height;
      updateViewBox(vbOrigX,vbOrigY,vbOrigW,vbOrigH);
      var orig   = CoordinatesService.transform(snap.node, 0,0);
      var borderLT = CoordinatesService.transform(snap.node, 30,20);
      var borderRB = CoordinatesService.transform(snap.node, 100,100);
      var deltaL = borderLT.x - orig.x;
      var deltaT = borderLT.y - orig.y;
      var deltaR = borderRB.x - orig.x;
      var deltaB = borderRB.y - orig.y;
      vbOrigX -= deltaL;
      vbOrigY -= deltaT;
      vbOrigW += deltaL + deltaR;
      vbOrigH += deltaT + deltaB;
      updateViewBox(vbOrigX,vbOrigY,vbOrigW,vbOrigH);
      context.flow.zoomScale = 1;
    }

    function addPanBehavior(dragElement, context) {
      function dragStart(event) {
        console.log('svg dragStart!',arguments);
        if (!event) {return;}
        event.stopPropagation();
        event.preventDefault();

        var startViewboxX = viewBoxX;
        var startViewboxY = viewBoxY;
        var original = getClientPos(event);

        snap.addClass('grabby-hand');

        function dragging(event) {
          console.log('svg dragging!',arguments);
          var newPos = getClientPos(event);
          var startPos = CoordinatesService.transform(snap.node, original.clientX, original.clientY);
          var currentPos = CoordinatesService.transform(snap.node, newPos.clientX, newPos.clientY);
          var differenceX = currentPos.x - startPos.x;
          var differenceY = currentPos.y - startPos.y;
          var newX = startViewboxX - differenceX;
          var newY = startViewboxY - differenceY;
          updateViewBox(newX, newY, viewBoxW, viewBoxH);
        }

        function dropped(event) {
          dragElement.removeEventListener('mousemove', dragging);
          dragElement.removeEventListener('mouseup', dropped);
          snap.untouchmove(dragging);
          snap.untouchend(dropped);
          snap.removeClass('grabby-hand');
        }

        dragElement.addEventListener('mousemove', dragging);
        dragElement.addEventListener('mouseup', dropped);
        snap.touchmove(dragging);
        snap.touchend(dropped);
      };

      dragElement.addEventListener('dragstart', dragStart);
      snap.touchstart(dragStart);
    }

    addPanBehavior(snap.node, context);
    addZoomBehavior(snap.node, context);
    addClickBehavior(snap, undefined, backgroundClicked);

    return {

      render: function() {
        // WARNING: don't add listeners here!
        if (!context.flow) { return; }
        console.log("rendering!");
        //context.flow = flow;
        if (!snap.attr('viewBox')){
          updateViewBox(vbOrigX,vbOrigY,vbOrigH,vbOrigW);
          context.flow.zoomScale = 1;
        }

        var newLinkMap = _.indexBy(context.flow.links,function(link){
          return FlowLinkRenderer.getLinkId(link);
        });
        var newLinksDiff = objDiff(newLinkMap,lastLinks);
        var oldLinksDiff = objDiff(lastLinks,newLinkMap);
        // console.log('newLinksDiff:',newLinksDiff);
        // console.log('oldLinksDiff:',oldLinksDiff);
        lastLinks = _.cloneDeep(newLinkMap);
        linkMap = newLinkMap;
        renderLinks(newLinksDiff,oldLinksDiff);

        var newNodeMap = _.indexBy(context.flow.nodes,'id');
        var newNodesDiff = objDiff(newNodeMap,lastNodes);
        var oldNodesDiff = objDiff(lastNodes,newNodeMap);
        // console.log('newNodesDiff:',newNodesDiff);
        // console.log('oldNodesDiff:',oldNodesDiff);
        lastNodes = _.cloneDeep(newNodeMap);
        nodeMap = newNodeMap;
        renderNodes(newNodesDiff,oldNodesDiff);
      },

      on: function(event, callback) {
        return dispatch.on(event, callback);
      },
      updateViewBox: updateViewBox,
      updateZoomScale: updateZoomScale,
      centerViewBox: centerViewBox
    };
  };
});
