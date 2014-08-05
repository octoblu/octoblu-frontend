angular.module('octobluApp')
  .service('FlowNodeRenderer', function (FlowNodeTypeService) {
    var flowNodeTypes;
    FlowNodeTypeService.getFlowNodeTypes()
      .then(function (flowNodeTypes) {
        flowNodeTypes = _.indexBy(flowNodeTypes, 'name');
      });

    var nodeType = {
      width: 100,
      height: 35
    };

    return function (renderScope) {
      var dispatch = d3.dispatch('nodeChanged', 'nodeMoved', 'nodeClicked');
      var dragBehavior = d3.behavior.drag()
        .on('dragstart', function () {
          d3.event.sourceEvent.stopPropagation();
        })
        .on('drag', function (flowNode) {
          flowNode.x = d3.event.x - (nodeType.width / 2);
          flowNode.y = d3.event.y - (nodeType.height / 2);
          d3.select(this)
            .attr("transform", "translate(" + flowNode.x + "," + flowNode.y + ")");
          dispatch.nodeMoved(flowNode);
        })
        .on('dragend', function (flowNode) {
          dispatch.nodeChanged(flowNode);
        });

      return {
        render: function (nodes) {
          var nodeData = renderScope.selectAll('.flow-node').data(nodes);

          var nodeGroup = nodeData.enter()
            .append('g')
            .attr('class', function (node) {
              var classes = ['flow-node'];
              classes.push('flow-node-' + node.type);
              return classes.join(' ');
            })
            .attr('transform', function (node) {
              return 'translate(' + node.x + ',' + node.y + ')';
            })
            .on('click', function (flowNode) {
              if (d3.event.defaultPrevented) {
                return;
              }

              d3.event.preventDefault();
              dispatch.nodeClicked(flowNode);
            })
            .call(dragBehavior);

          nodeGroup.append('rect')
            .attr('width', nodeType.width)
            .attr('height', nodeType.height)
            .attr('rx', 6)
            .attr('ry', 6)
            .classed('flow-node-bg', true)

          nodeGroup.append('text')
            .classed('flow-node-label', true)
            .attr('y', nodeType.height / 2)
            .attr('x', nodeType.width / 2)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'central')
            .text(function (node) {
              return node.name || node.type;
            });

          nodeData.exit().remove();

          return nodeData;
        },
        clear: function () {
          renderScope.selectAll('.flow-node').remove();
        },
        on: function (event, callback) {
          return dispatch.on(event, callback);
        }
      };
    };
  });
