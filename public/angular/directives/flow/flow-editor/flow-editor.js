angular.module('octobluApp')
    .directive('flowEditor', function () {
        return {
            restrict: 'E',
            templateUrl: '/angular/directives/flow/flow-editor/flow-editor.html',
            replace: true,
            scope: {
                flow: '='
            },
            link: function ($scope, element) {
                var svg = element.find('svg');
                var flowRender = d3.select(svg[0]);
                var nodesById = {};

                var dragBehavior = d3.behavior.drag()
                    .on('dragstart', function(){
                        d3.event.sourceEvent.stopPropagation();
                    })
                    .on('drag', function(flowNode){
                        flowNode.x = d3.event.x;
                        flowNode.y = d3.event.y;
                        d3.select(this).attr("transform",
                                "translate(" + d3.event.x + "," + d3.event.y + ")");
                        d3.selectAll('.contains-node-' + flowNode.id).attr('d', renderPath);
                    }).on('dragend', function(){
                        $scope.$apply();
                    });

                var nodeType = {
                    width: 100,
                    height: 35
                };

                function renderNodes(flow) {
                    var nodeData = flowRender.selectAll('.flow-node').data(flow.nodes),
                        nodeEnter = nodeData.enter();

                    var nodeGroup = nodeEnter.append('g')
                        .attr('class', function (node) {
                            return 'flow-node flow-node-' + node.type;
                        })
                        .attr('transform', function (node) {
                            return 'translate(' + node.x + ',' + node.y + ')';
                        })
                        .call(dragBehavior);

                    nodeGroup.append('rect')
                        .attr('width', nodeType.width)
                        .attr('height', nodeType.height)
                        .attr('rx', 6)
                        .attr('ry', 6)
                        .classed('flow-node-bg', true);

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
                }

                function renderLinks(flow) {
                    var linkData = flowRender.selectAll('.flow-link').data(flow.links);
                    linkData.enter()
                        .append('path')
                        //change to function to change link type based on nodes (unknown).
                        .attr('class', function(link){
                            var classes = [ 'flow-link' ];
                            classes.push('contains-node-' + link.from);
                            classes.push('contains-node-' + link.to);

                            return classes.join(' ');
                        })
                        .attr('d', renderPath);

                    linkData.exit().remove();
                }

                function render(flow) {
                    renderNodes(flow);
                    renderLinks(flow);
                }

                function clear() {
                    flowRender.selectAll('.flow-node').remove();
                    flowRender.selectAll('.flow-link').remove();
                }

                //if the *contents* of a flow change.
                $scope.$watch('flow', function (newFlow, oldFlow) {
                    if(oldFlow && newFlow !== oldFlow) {
                        clear();
                    }

                    if (newFlow && newFlow.nodes) {
                        nodesById = _.indexBy(newFlow.nodes, 'id');
                        render(newFlow);
                    }
                }, true);

                function renderPath(link) {
                    var renderLine = d3.svg.line()
                        .x(function (coordinate) {
                            return coordinate.x;
                        })
                        .y(function (coordinate) {
                            return coordinate.y;
                        })
                        .interpolate('basis');

                        var sourceNode = nodesById[link.from],
                            targetNode = nodesById[link.to];

                        var fromCoordinate = {
                            x: sourceNode.x + nodeType.width,
                            y: sourceNode.y + (nodeType.height / 2)
                        };

                        var fromCoordinateCurveStart = {
                            x: fromCoordinate.x + nodeType.height,
                            y: fromCoordinate.y};

                        var toCoordinate = {x: targetNode.x, y: targetNode.y + (nodeType.height / 2)};

                        var toCoordinateCurveStart = {x: toCoordinate.x - nodeType.height, y: toCoordinate.y};

                        return renderLine([fromCoordinate, fromCoordinateCurveStart, toCoordinateCurveStart, toCoordinate]);
                }
            }
        };
    });
