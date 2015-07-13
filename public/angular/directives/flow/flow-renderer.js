angular.module('octobluApp')
.service('FlowRenderer', function (FlowNodeRenderer, FlowLinkRenderer, LinkRenderer, FlowNodeDimensions, CoordinatesService) {
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
    var snapParent = $(snap.node).parent()[0];
    var hammerSnap = new Hammer(snapParent);

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

    function Dispatch() {
      var patch = {};
      _.each(arguments, function(name){
        patch[name] = function(){ console.log(' ! default dispatch for ', name); };
      });
      return patch;
    }
    var dispatch = Dispatch('flowChanged', 'nodeSelected', 'linkSelected', 'nodeButtonClicked');

    function updateViewBox(x,y,w,h) {
      if (w<1 || h<1) return;
      if (w>1000000 || h>1000000) return;
      viewBoxX = x;
      viewBoxY = y;
      viewBoxW = w;
      viewBoxH = h;
      snap.attr({'viewBox': [x,y,w,h].join(' ')});
    }

    function updateZoomScale(scale) {
      scale = scale || 1;
      var w = vbOrigW / scale;
      var h = vbOrigH / scale;
      var x = viewBoxX - (w-viewBoxW)/2;
      var y = viewBoxY - (h-viewBoxH)/2;
      updateViewBox(x,y,w,h);
    }

    function centerViewBox() {
      if(!context.flow ||
         !context.flow.nodes ||
         !context.flow.nodes.length) {
        return;
      }
      var vb = snap.select('.flow-render-area').getBBox();
      viewBoxX = vbOrigX = vb.x;
      viewBoxY = vbOrigY = vb.y;
      viewBoxW = vbOrigW = vb.width;
      viewBoxH = vbOrigH = vb.height;
      context.flow.zoomScale = 0.75;
      updateZoomScale(context.flow.zoomScale);
      flowMultiTouchCounter = 0;
    }

    function shouldAbort(event,enabled) {
      if (!enabled) return true;
      if (!event) return true;
      if (event.srcEvent) {
        event.srcEvent.stopPropagation();
        event.srcEvent.preventDefault();
      } else {
        event.stopPropagation();
        event.preventDefault();
      }
      return false;
    }

    function addClickBehavior(element, node, callback) {
      if (!element) return;
      var hammer = new Hammer(element);
      var enabled;

      function tap(event){
        if (shouldAbort(event,enabled)) return;
        if (callback) {
          callback(node);
        }
      }

      hammer.get('tap').set({enable:true});

      function enable() {
        hammer.on('tap', tap);
        enabled = true;
      }

      function disable() {
        hammer.off('tap', tap);
        enabled = false;
      }

      enable();
      return { enable:enable, disable:disable };
    }

    function addNodeDragBehavior(dragGroup, dragItem, node, flow, tmpFlow) {
      if (!dragItem) return;
      var hammer = new Hammer(dragItem.node);
      var enabled;
      var moveInfo;

      function panstart(event) {
        if (shouldAbort(event,enabled)) return;
        disableFlowBehavior();
        moveInfo = { flow : tmpFlow };
        dispatch.nodeSelected(node);
        select(dragGroup);
      }

      function moveNode(event,tmpNode) {
        var to = CoordinatesService.transform(snap.node, event.center.x, event.center.y);
        tmpNode.x = to.x - (FlowNodeDimensions.width / 2);
        tmpNode.y = to.y - (FlowNodeDimensions.minHeight / 2);
        updateLinks(tmpNode.id, moveInfo, {x:tmpNode.x,y:tmpNode.y});
        dragGroup.attr({"transform":"translate("+tmpNode.x+","+tmpNode.y+")"});
        if (nodeMoveDispatch[tmpNode.id]) {
          nodeMoveDispatch[tmpNode.id]();
        }
      }

      function panmove(event) {
        if (shouldAbort(event,enabled)) return;
        var tmpNode = _.find(tmpFlow.nodes, {id:node.id});
        if (!tmpNode) return;
        moveNode(event,tmpNode);
      }

      function panend(event) {
        if (shouldAbort(event,enabled)) return;
        enableFlowBehavior();
        var tmpNode = _.find(tmpFlow.nodes, {id:node.id});
        if (!tmpNode) return;
        var lastNode = lastNodes[node.id];
        moveNode(event,tmpNode);
        node.x = lastNode.x = tmpNode.x;
        node.y = lastNode.y = tmpNode.y;
        dispatch.flowChanged();
      }

      function pancancel(event) {
        if (shouldAbort(event,enabled)) return;
        enableFlowBehavior();
      }

      hammer.get('pan').set({threshold:5});
      function enable(){
        hammer.on('panstart', panstart);
        hammer.on('panmove', panmove);
        hammer.on('panend', panend);
        hammer.on('pancancel', pancancel);
        enabled = true;
      }

      function disable() {
        hammer.off('panstart', panstart);
        hammer.off('panmove', panmove);
        hammer.off('panend', panend);
        hammer.off('pancancel', pancancel);
        enabled = false;
      }

      enable();
      return { enable:enable, disable:disable };

    }

    function addPortDragBehavior(node, portElement, tmpFlow) {
      if (!portElement) return;
      var hammer = new Hammer(portElement.node);
      var enabled;

      var bbox = portElement.getBBox();
      var linkElement;
      var isInputPort = portElement.hasClass('flow-node-input-port');
      var isOutputPort = portElement.hasClass('flow-node-output-port');
      var lastEvent;

      function nodeMoved() {
          panmove(lastEvent);
      }

      function panstart(event) {
        if (shouldAbort(event,enabled)) return;
        disableFlowBehavior();
        linkElement = undefined;
        lastEvent = event;
        nodeMoveDispatch[node.id] = nodeMoved;
      }

      function panmove(event) {
        if (shouldAbort(event,enabled)) return;
        lastEvent = event;
        var tmpNode = _.find(tmpFlow.nodes, {id:node.id});
        if (!tmpNode) return;

        var to = CoordinatesService.transform(snap.node,event.center.x,event.center.y);
        if (isInputPort) {
          linkElement = LinkRenderer.render(snap, to, null, {to:tmpNode.id}, [tmpNode], linkElement,
            ['flow-potential-link-input-'+node.id]);
        }
        if (isOutputPort) {
          linkElement = LinkRenderer.render(snap, null, to, {from:tmpNode.id}, [tmpNode], linkElement,
            ['flow-potential-link-output-'+node.id]);
        }
      }

      function panend(event) {
        if (shouldAbort(event,enabled)) return;
        enableFlowBehavior();
        delete nodeMoveDispatch[node.id];
        var tmpNode = _.find(tmpFlow.nodes, {id:node.id});
        if (!tmpNode) return;

        var target = CoordinatesService.transform(snap.node, event.center.x, event.center.y);
        var newLink = undefined;

        if (isInputPort) {
          var outputNode = FlowNodeRenderer.findNodeByCoordinates(target.x, target.y, tmpFlow.nodes);
          if(outputNode && outputNode.output && tmpNode.id != outputNode.id) {
            newLink = {from: outputNode.id, fromPort: 0, to: tmpNode.id, toPort: 0};
          }
        }

        if (isOutputPort) {
          var inputNode = FlowNodeRenderer.findNodeByCoordinates(target.x, target.y, tmpFlow.nodes);
          if(inputNode && inputNode.input && tmpNode.id != inputNode.id) {
            newLink = {from: tmpNode.id, fromPort: 0, to: inputNode.id, toPort: 0};
          }
        }

        if (newLink && !_.find(tmpFlow.links,newLink)) {
          tmpFlow.links = tmpFlow.links || [];
          tmpFlow.links.push(newLink);
          context.flow.links.push(newLink);
          linkElement = LinkRenderer.render(snap, null, null, newLink, tmpFlow.nodes, linkElement);
          linkElement.removeClass('flow-potential-link-input-'+node.id);
          linkElement.removeClass('flow-potential-link-output-'+node.id);
          addClickBehavior(linkElement.node, newLink, selectCallback(linkElement, dispatch.linkSelected));
          var linkId = FlowLinkRenderer.getLinkId(newLink);
          lastLinks[linkId] = newLink;
          linkElements[linkId] = linkElement;
          dispatch.flowChanged();
          return;
        }

        if (isInputPort)  {
          snap.selectAll('.flow-potential-link-input-'+node.id).remove();
        }
        if (isOutputPort)  {
          snap.selectAll('.flow-potential-link-output-'+node.id).remove();
        }
      }

      function pancancel(event) {
        if (shouldAbort(event,enabled)) return;
        enableFlowBehavior();
        if (isInputPort)  {
          snap.selectAll('.flow-potential-link-input-'+node.id).remove();
        }
        if (isOutputPort)  {
          snap.selectAll('.flow-potential-link-output-'+node.id).remove();
        }
      }

      hammer.get('pan').set({threshold:5});

      function enable(){
        hammer.on('panstart', panstart);
        hammer.on('panmove', panmove);
        hammer.on('panend', panend);
        hammer.on('pancancel', pancancel);
        enabled = true;
      }

      function disable() {
        hammer.off('panstart', panstart);
        hammer.off('panmove', panmove);
        hammer.off('panend', panend);
        hammer.off('pancancel', pancancel);
        enabled = false;
      }

      enable();
      return { enable:enable, disable:disable };
    }

    function addFlowPanBehavior() {
      var enabled;
      var startViewboxX;
      var startViewboxY;
      var original;

      function panstart(event) {
        if (shouldAbort(event,enabled)) return;
        startViewboxX = viewBoxX;
        startViewboxY = viewBoxY;
        original = event;
        snap.addClass('grabby-hand');
      }

      function panmove(event) {
        if (shouldAbort(event,enabled)) return;
        var startPos = CoordinatesService.transform(snap.node, original.center.x, original.center.y);
        var currentPos = CoordinatesService.transform(snap.node, event.center.x, event.center.y);
        var differenceX = currentPos.x - startPos.x;
        var differenceY = currentPos.y - startPos.y;
        var newX = startViewboxX - differenceX;
        var newY = startViewboxY - differenceY;
        updateViewBox(newX, newY, viewBoxW, viewBoxH);
      }

      function panend(event) {
        if (shouldAbort(event,enabled)) return;
        snap.removeClass('grabby-hand');
      }

      hammerSnap.get('pan').set({threshold:5});

      function enable(){
        snap.removeClass('grabby-hand');
        hammerSnap.on('panstart', panstart);
        hammerSnap.on('panmove', panmove);
        hammerSnap.on('panend', panend);
        enabled = true;
      }

      function disable() {
        hammerSnap.off('panstart', panstart);
        hammerSnap.off('panmove', panmove);
        hammerSnap.off('panend', panend);
        enabled = false;
      }

      enable();
      return { enable:enable, disable:disable };
    }

    function addFlowZoomBehavior() {
      var enabled;
      var origViewBoxW;
      var origViewBoxH;

      function zoomStart() {
        origViewBoxW = viewBoxW;
        origViewBoxH = viewBoxH;
      }

      function zoom(scaleChange) {
        var newW = origViewBoxW * scaleChange;
        var newH = origViewBoxH * scaleChange;
        var newX = viewBoxX - (newW - viewBoxW)/2;
        var newY = viewBoxY - (newH - viewBoxH)/2;
        updateViewBox(newX,newY,newW,newH);
        context.flow.zoomScale = vbOrigW/newW;
      }

      function pinchmove(event) {
        if (shouldAbort(event,enabled)) return;
        zoom(1/event.scale);
      }

      function pinchstart(event) {
        if (!enabled) return;
        zoomStart();
      }

      snapParent.addEventListener('wheel', function(event) {
        if (shouldAbort(event,enabled)) return;
        zoomStart();
        zoom( 1+(event.deltaY/event.screenY) );
      });

      hammerSnap.get('pinch').set({enable:true});

      function enable() {
        hammerSnap.on('pinchstart', pinchstart);
        hammerSnap.on('pinchmove', pinchmove);
        enabled = true;
      }

      function disable() {
        hammerSnap.off('pinchstart', pinchstart);
        hammerSnap.off('pinchmove', pinchmove);
        enabled = false;
      }

      enable();
      return { enable:enable, disable:disable };
    }

    (function setupRenderArea() {
      var editorArea = snap.select('.flow-render-area');
      if (!editorArea) {
        editorArea = snap.group().addClass('flow-render-area');
        snap.append(editorArea);
      }
      var linkArea = snap.select('.flow-link-area');
      if (!linkArea) {
        linkArea = snap.group().addClass('flow-link-area');
        editorArea.append(linkArea);
      }
    })();

    var firstView = true;
    var nodeMoveDispatch = {};
    var tmpFlow = {};
    var flowBehavior = {};
    if (!readonly) {
      flowBehavior.pan = addFlowPanBehavior();
      flowBehavior.zoom = addFlowZoomBehavior();
      flowBehavior.click = addClickBehavior(snapParent, undefined, backgroundClicked);
    }

    var flowMultiTouchCounter = 0;

    function enableFlowBehavior() {
      if (--flowMultiTouchCounter < 0) flowMultiTouchCounter=0;
      if (flowMultiTouchCounter !== 0) return;
      _.each(flowBehavior,function(behavior){
        behavior.enable();
      });
    }

    function disableFlowBehavior() {
      if (flowMultiTouchCounter++ !== 0) return;
      _.each(flowBehavior,function(behavior){
        behavior.disable();
      });
    }

    function renderLinks(newLinksDiff, oldLinksDiff) {
      _.each(newLinksDiff, function (link, linkId) {
        if (!oldLinksDiff[linkId]) {
          snap.selectAll('#'+linkId).remove();
          var linkElement = FlowLinkRenderer.render(snap, link, context.flow);
          if (linkElement) {
            linkElements[linkElement.attr('id')] = linkElement;
            if (!readonly){
              addClickBehavior(linkElement.node, link, selectCallback(linkElement, dispatch.linkSelected));
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
      info = info || {};
      var flow = info.flow || tmpFlow || context.flow;
      var toLinks = info.toLinks || _.where(flow.links,{to:nodeId});
      var fromLinks = info.fromLinks || _.where(flow.links,{from:nodeId});
      var processLinks = function(links, loc) {
        _.each(links, function (link) {
          var linkElement = linkElements[FlowLinkRenderer.getLinkId(link)];
          if (linkElement) {
            FlowLinkRenderer.render(snap, link, flow, loc, linkElement);
          }
        });
      };
      processLinks(toLinks,{to:pos});
      processLinks(fromLinks,{from:pos});
    }

    function renderNodes(newNodesDiff, oldNodesDiff) {
      _.each(newNodesDiff, function (node) {
        if (oldNodesDiff[node.id]) {
          updateLinks(node.id, {flow:context.flow});
        }
        var nodeElement = FlowNodeRenderer.render(snap, node, context, nodeElements[node.id]);
        if (!nodeElement) {
          return;
        }
        nodeElements[node.id] = nodeElement;
        if(readonly){
          return;
        }
        var nodeImage = nodeElement.select("image:last-of-type");
        var nodeButton = snap.select('#node-button-'+node.id);
        if (nodeImage){
          addClickBehavior(nodeImage.node, node, selectCallback(nodeElement, dispatch.nodeSelected));
        }
        if (nodeButton){
          addClickBehavior(nodeButton.node, node, dispatch.nodeButtonClicked);
        }
        addNodeDragBehavior(nodeElement, nodeImage, node, context.flow, tmpFlow);
        _.each(nodeElement.selectAll('.flow-node-port'), function(portElement){
          addPortDragBehavior(node, portElement, tmpFlow);
        });
      });
      _.each(oldNodesDiff, function (node) {
        if (!newNodesDiff[node.id]) {
          delete nodeElements[node.id];
          snap.selectAll('#node-'+node.id).remove();
          snap.selectAll('.flow-link-to-'+node.id).remove();
          snap.selectAll('.flow-link-from-'+node.id).remove();
        }
      });
    }

    return {

      render: function() {
        if (!context.flow) { return; }

        if (!snap.attr('viewBox')){
          updateViewBox(vbOrigX,vbOrigY,vbOrigH,vbOrigW);
          context.flow.zoomScale = 1;
        }

        var newLinkMap = _.indexBy(context.flow.links,function(link){
          return FlowLinkRenderer.getLinkId(link);
        });
        var newLinksDiff = objDiff(newLinkMap,lastLinks);
        var oldLinksDiff = objDiff(lastLinks,newLinkMap);
        lastLinks = _.cloneDeep(newLinkMap);
        linkMap = newLinkMap;
        renderLinks(newLinksDiff,oldLinksDiff);

        var newNodeMap = _.indexBy(context.flow.nodes,'id');
        var newNodesDiff = objDiff(newNodeMap,lastNodes);
        var oldNodesDiff = objDiff(lastNodes,newNodeMap);
        lastNodes = _.cloneDeep(newNodeMap);
        nodeMap = newNodeMap;
        renderNodes(newNodesDiff,oldNodesDiff);

        if (_.size(newNodesDiff) !== 0 ||
            _.size(oldNodesDiff) !== 0) {
          tmpFlow.nodes = _.cloneDeep(context.flow.nodes);
        }

        if (_.size(newLinksDiff) !== 0 ||
            _.size(oldLinksDiff) !== 0) {
          tmpFlow.links = _.cloneDeep(context.flow.links);
        }

        if (firstView) {
          if (readonly) {
            context.flow.selectedFlowNode = undefined;
            context.flow.selectedLink = undefined;
          }
          centerViewBox();
          firstView = false;
        }
      },

      on: function(event, callback) {
        return dispatch[event] = callback;
      },
      updateViewBox: updateViewBox,
      updateZoomScale: updateZoomScale,
      centerViewBox: centerViewBox
    };
  };
});
