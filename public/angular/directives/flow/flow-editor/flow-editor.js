angular.module('octobluApp')
    .directive('flowEditor', function ($compile) {
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

                var nodeType = {
                    width: 100,
                    height: 35,
                    color: "orange"
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
                        });

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
                    //Describes how to pull x/y coordinates out of the data.
                    var renderPath = d3.svg.line()
                        .x(function (coordinate) {
                            return coordinate.x;
                        })
                        .y(function (coordinate) {
                            return coordinate.y;
                        })
                        .interpolate('basis');

                    var nodesById = _.indexBy(flow.nodes, 'id');
                    var linkData = flowRender.selectAll('.flow-link')
                        .data(flow.links);

                    linkData.enter()
                        .append('path')
                        .classed('flow-link', true)
                        .attr('stroke', 'blue')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none')
                        .attr('d', function (link) {
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

                            return renderPath([fromCoordinate, fromCoordinateCurveStart, toCoordinateCurveStart, toCoordinate]);
                        });

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
                        render(newFlow);
                    }
                }, true);
            }
        }
    })
;
