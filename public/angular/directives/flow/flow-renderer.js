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
      return !( _.isEqual(value,oldObj[key]) && (value === oldObj[key]));
    });
    return objDiff;
  };

  return function (snap, options) {
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

    var dragNodeMap = {};
    var flowNodeMap, flowLinkMap;
    var tmpNodeMap, tmpLinkMap;
    var toLinkMap, fromLinkMap;

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

    function select(snapElement) {
      unselectAll();
      snapElement.toggleClass('selected',true);
    }

    function selectCallback(snapElement, callback) {
      return function(data) {
        select(snapElement);
        callback(data);
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
      if(!flow ||
         !flow.nodes ||
         !flow.nodes.length) {
        return;
      }
      var vb = snap.select('.flow-render-area').getBBox();
      viewBoxX = vbOrigX = vb.x;
      viewBoxY = vbOrigY = vb.y;
      viewBoxW = vbOrigW = vb.width;
      viewBoxH = vbOrigH = vb.height;
      var n = flow.nodes.length;
      flow.zoomScale = n/(n+1) - 0.2;
      updateZoomScale(flow.zoomScale);
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

    function addClickBehavior(element, data, callback) {
      if (!element) return;
      var hammer = new Hammer(element);
      var enabled;

      function tap(event){
        if (shouldAbort(event,enabled)) return;
        if (callback) {
          callback(data);
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

    function addNodeDragBehavior(dragGroup, dragItem, node) {
      if (!dragItem) return;
      var hammer = new Hammer(dragItem.node);
      var enabled;

      function panstart(event) {
        if (shouldAbort(event,enabled)) return;
        disableFlowBehavior();
        dispatch.nodeSelected(node);
        select(dragGroup);
        var tmpNode = tmpNodeMap[node.id];
        if (!tmpNode) return;
        dragNodeMap[node.id] = {id:tmpNode.id, x:tmpNode.x, y:tmpNode.y};
      }

      function moveNode(event,node) {
        if (!node) return;
        var to = CoordinatesService.transform(snap.node, event.center.x, event.center.y);
        node.x = to.x - (FlowNodeDimensions.width / 2);
        node.y = to.y - (FlowNodeDimensions.minHeight / 2);
        renderNodeLinks(node.id, {x:node.x,y:node.y});
        dragGroup.attr({"transform":"translate("+node.x+","+node.y+")"});
        if (nodeMoveDispatch[node.id+'-input']) {
          nodeMoveDispatch[node.id+'-input']();
        }
        if (nodeMoveDispatch[node.id+'-output']) {
          nodeMoveDispatch[node.id+'-output']();
        }
      }

      function panmove(event) {
        if (shouldAbort(event,enabled)) return;
        moveNode(event,dragNodeMap[node.id]);
      }

      function panend(event) {
        if (shouldAbort(event,enabled)) return;
        enableFlowBehavior();
        delete dragNodeMap[node.id];
        var tmpNode = tmpNodeMap[node.id];
        if (!tmpNode) return;
        moveNode(event,tmpNode);
        flowNodeMap[node.id].x = tmpNode.x;
        flowNodeMap[node.id].y = tmpNode.y;
        dispatch.flowChanged();
      }

      function pancancel(event) {
        if (shouldAbort(event,enabled)) return;
        enableFlowBehavior();
      }

      hammer.get('pan').set({threshold:5, direction:Hammer.DIRECTION_ALL});

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

    function addPortDragBehavior(node, portElement) {
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
        if (isInputPort) {
          nodeMoveDispatch[node.id+'-input'] = nodeMoved;
        }
        if (isOutputPort) {
          nodeMoveDispatch[node.id+'-output'] = nodeMoved;
        }
      }

      function panmove(event) {
        if (shouldAbort(event,enabled)) return;
        lastEvent = event;
        var tmpNode = tmpNodeMap[node.id];
        if (!tmpNode) return;
        var nodeMap = _.merge({},tmpNodeMap,dragNodeMap);

        var to = CoordinatesService.transform(snap.node,event.center.x,event.center.y);
        if (isInputPort) {
          linkElement = LinkRenderer.render(snap, to, null, {to:tmpNode.id}, nodeMap, linkElement,
            ['flow-potential-link-input-'+node.id]);
        }
        if (isOutputPort) {
          linkElement = LinkRenderer.render(snap, null, to, {from:tmpNode.id}, nodeMap, linkElement,
            ['flow-potential-link-output-'+node.id]);
        }
      }

      function panend(event) {
        if (shouldAbort(event,enabled)) return;
        enableFlowBehavior();
        if (isInputPort) {
          delete nodeMoveDispatch[node.id+'-input'];
        }
        if (isOutputPort) {
          delete nodeMoveDispatch[node.id+'-output'];
        }
        var tmpNode = tmpNodeMap[node.id];
        if (!tmpNode) return;
        var nodeMap = _.merge({},tmpNodeMap,dragNodeMap);

        var target = CoordinatesService.transform(snap.node, event.center.x, event.center.y);
        var newLink = undefined;

        if (isInputPort) {
          var outputNode = FlowNodeRenderer.findNodeByCoordinates(target.x, target.y, nodeMap);
          if(outputNode && outputNode.output && tmpNode.id != outputNode.id) {
            newLink = {from: outputNode.id, fromPort: 0, to: tmpNode.id, toPort: 0};
          }
        }

        if (isOutputPort) {
          var inputNode = FlowNodeRenderer.findNodeByCoordinates(target.x, target.y, nodeMap);
          if(inputNode && inputNode.input && tmpNode.id != inputNode.id) {
            newLink = {from: tmpNode.id, fromPort: 0, to: inputNode.id, toPort: 0};
          }
        }

        var linkId = FlowLinkRenderer.getLinkId(newLink);

        if (newLink && !tmpLinkMap[linkId]) {
          tmpLinkMap[linkId]=newLink;
          flow.links.push(newLink);
          linkElement = LinkRenderer.render(snap, null, null, newLink, nodeMap, linkElement);
          linkElement.removeClass('flow-potential-link-input-'+node.id);
          linkElement.removeClass('flow-potential-link-output-'+node.id);
          addClickBehavior(linkElement.node, newLink, selectCallback(linkElement, dispatch.linkSelected));
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

      hammer.get('pan').set({threshold:5, direction:Hammer.DIRECTION_ALL});

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

      hammerSnap.get('pan').set({threshold:5, direction:Hammer.DIRECTION_ALL});

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
        flow.zoomScale = vbOrigW/newW;
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

    var flow;
    var firstView = true;
    var nodeMoveDispatch = {};
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

    function deleteOldLinks(newLinksDiff, oldLinksDiff) {
      _.each(oldLinksDiff, function (link, linkId) {
        if (!newLinksDiff[linkId]) {
          delete linkElements[linkId];
          snap.selectAll('#'+linkId).remove();
        }
      });
    }

    function renderLink(link, linkId, loc, nodeMap) {
      snap.selectAll('#'+linkId).remove();
      var linkElement = linkElements[linkId] =
        FlowLinkRenderer.render(snap, link, nodeMap, loc, linkElements[linkId]);
      if (!linkElement) {
        console.log('unable to create link:',link);
        //flow.links = _.without(flow.links,link);
        return;
      }
      linkElement.toggleClass('selected', (link === flow.selectedLink));
      if (!readonly){
        addClickBehavior(linkElement.node, link, selectCallback(linkElement, dispatch.linkSelected));
      }
    }

    function renderNodeLinks(nodeId, pos, nodeMap) {
      nodeMap = nodeMap || _.merge({},tmpNodeMap,dragNodeMap);
      var toLinks = toLinkMap[nodeId];
      var fromLinks = fromLinkMap[nodeId];
      var processLinks = function(links, loc) {
        _.each(links, function (link) {
          var linkId = FlowLinkRenderer.getLinkId(link);
          renderLink(link, linkId, loc, nodeMap);
        });
      };

      processLinks(toLinks,{to:pos});
      processLinks(fromLinks,{from:pos});
    }

    function renderNodes(newNodesDiff, oldNodesDiff) {
      _.each(newNodesDiff, function (node) {
        if (oldNodesDiff[node.id] || toLinkMap[node.id] || fromLinkMap[node.id]) {
          renderNodeLinks(node.id,null,tmpNodeMap);
        }
        var nodeElement = FlowNodeRenderer.render(snap, node, nodeElements[node.id]);
        if (!nodeElement) {
          return;
        }
        nodeElement.toggleClass('selected', (node === flow.selectedFlowNode))
        nodeElements[node.id] = nodeElement;

        if(readonly){
          return;
        }

        var nodeImage = nodeElement.select("image:last-of-type");
        if (nodeImage){
          addClickBehavior(nodeImage.node, node, selectCallback(nodeElement, dispatch.nodeSelected));
          addNodeDragBehavior(nodeElement, nodeImage, node);
        }

        var nodeButton = snap.select('#node-button-'+node.id);
        if (nodeButton){
          addClickBehavior(nodeButton.node, node, dispatch.nodeButtonClicked);
        }

        _.each(nodeElement.selectAll('.flow-node-port'), function(portElement){
          addPortDragBehavior(node, portElement);
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

      render: function(newFlow) {
        if (!newFlow) { return; }
        flow = newFlow;

        if (!snap.attr('viewBox')){
          updateViewBox(vbOrigX,vbOrigY,vbOrigH,vbOrigW);
          flow.zoomScale = 1;
        }

        flowLinkMap = _.indexBy(flow.links,function(link){
          return FlowLinkRenderer.getLinkId(link);
        });
        toLinkMap = _.groupBy(flow.links,'to');
        fromLinkMap = _.groupBy(flow.links,'from');

        var newLinksDiff = objDiff(flowLinkMap,tmpLinkMap);
        var oldLinksDiff = objDiff(tmpLinkMap,flowLinkMap);
        tmpLinkMap = _.cloneDeep(flowLinkMap);

        flowNodeMap = _.indexBy(flow.nodes,'id');
        var newNodesDiff = objDiff(flowNodeMap,tmpNodeMap);
        var oldNodesDiff = objDiff(tmpNodeMap,flowNodeMap);
        tmpNodeMap = _.cloneDeep(flowNodeMap);

        console.log('number of flow nodes:', flow.nodes.length);
        console.log('diffs:', newNodesDiff, oldNodesDiff);

        deleteOldLinks(newLinksDiff,oldLinksDiff);
        renderNodes(newNodesDiff,oldNodesDiff);

        if (firstView) {
          if (readonly) {
            flow.selectedFlowNode = undefined;
            flow.selectedLink = undefined;
          }
          centerViewBox();
          firstView = false;
        }
      },

      on: function(event, callback) {
        return dispatch[event] = function(data) {
          var dataRef;
          if (data && event.startsWith("node")) {
            dataRef = flowNodeMap[data.id];
          }
          if (data && event.startsWith("link")) {
            dataRef = flowLinkMap[FlowLinkRenderer.getLinkId(data)];
          }
          return callback( dataRef || data );
        }
      },

      updateViewBox: updateViewBox,
      updateZoomScale: updateZoomScale,
      centerViewBox: centerViewBox
    };
  };
});
